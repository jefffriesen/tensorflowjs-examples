import _ from 'lodash'
import * as tf from '@tensorflow/tfjs'
import {
  configure,
  observable,
  decorate,
  action,
  computed,
  runInAction,
  autorun
} from 'mobx'
import {
  loadCsv,
  arraysToTensors,
  shuffle,
  linearRegressionModel,
  describeKernelElements,
  computeBaselineLoss,
  computeAveragePrice,
  multiLayerPerceptronRegressionModel1Hidden,
  multiLayerPerceptronRegressionModel2Hidden,
  calculateFinalLoss,
  calculateTestSetLoss
} from './utils'
configure({ enforceActions: 'observed' })

const basePath = './data/boston_housing/'
const csvOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  delimiter: ','
}

const featureDescriptions = [
  'Crime rate',
  'Land zone size',
  'Industrial proportion',
  'Next to river',
  'Nitric oxide concentration',
  'Number of rooms per house',
  'Age of housing',
  'Distance to commute',
  'Distance to highway',
  'Tax rate',
  'School class size',
  'School drop-out rate'
]

/**
 * Boston Housing
 */
class BostonStore {
  constructor() {
    autorun(() => this.fetchBostonFiles(this.bostonFilesInfo))
  }

  NUM_EPOCHS = 50
  BATCH_SIZE = 40
  LEARNING_RATE = 0.01
  tensors = {}
  numFeatures = null
  bostonDataIsLoading = true
  currentEpoch = {
    linear: 0,
    oneHidden: 0,
    twoHidden: 0
  }
  trainingState = {
    linear: 'None',
    oneHidden: 'None',
    twoHidden: 'None'
  }
  trainLogs = {
    linear: [],
    oneHidden: [],
    twoHidden: []
  }
  weightsList = {
    linear: []
  }
  finalTrainSetLoss = {
    linear: null,
    oneHidden: null,
    twoHidden: null
  }
  finalValidationSetLoss = {
    linear: null,
    oneHidden: null,
    twoHidden: null
  }
  testSetLoss = {
    linear: null,
    oneHidden: null,
    twoHidden: null
  }
  model = {
    linear: null,
    oneHidden: null,
    twoHidden: null
  }

  get weightsListLinearSorted() {
    return this.weightsList.linear
      .slice()
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
  }

  get averagePrice() {
    return this.bostonDataIsLoading ? null : computeAveragePrice(this.tensors)
  }

  get baselineLoss() {
    return this.bostonDataIsLoading ? null : computeBaselineLoss(this.tensors)
  }

  get readyToModel() {
    return !this.bostonDataIsLoading && Boolean(this.numFeatures)
  }

  async trainLinearRegressor() {
    const model = linearRegressionModel(this.numFeatures)
    await this.run({
      model,
      tensors: this.tensors,
      modelName: 'linear',
      weightsIllustration: true,
      LEARNING_RATE: this.LEARNING_RATE,
      BATCH_SIZE: this.BATCH_SIZE,
      NUM_EPOCHS: this.NUM_EPOCHS
    })
  }

  async trainNeuralNetworkLinearRegression1Hidden() {
    const model = multiLayerPerceptronRegressionModel1Hidden(this.numFeatures)
    await this.run({
      model,
      tensors: this.tensors,
      modelName: 'oneHidden',
      weightsIllustration: false, // Cannot calculate weights with this type of model
      LEARNING_RATE: this.LEARNING_RATE,
      BATCH_SIZE: this.BATCH_SIZE,
      NUM_EPOCHS: this.NUM_EPOCHS
    })
  }

  async trainNeuralNetworkLinearRegression2Hidden() {
    const model = multiLayerPerceptronRegressionModel2Hidden(this.numFeatures)
    await this.run({
      model,
      tensors: this.tensors,
      modelName: 'twoHidden',
      weightsIllustration: false, // Cannot calculate weights with this type of model
      LEARNING_RATE: this.LEARNING_RATE,
      BATCH_SIZE: this.BATCH_SIZE,
      NUM_EPOCHS: this.NUM_EPOCHS
    })
  }

  // The reason this complicated function is in the store is because it wiil
  // update the UI by saving out an obervable as it trains. Since it's in the
  // store I could just reference all of the store values like BATCH_SIZE intead
  // of passing them in. I prefer to explicitly pass them in though since it
  // makes a clearer and more testable function. But this function has side effects
  // I could put this in utils and then just pass in this.currentEpoch and trainLogs
  async run({
    model,
    tensors,
    modelName,
    weightsIllustration,
    LEARNING_RATE,
    BATCH_SIZE,
    NUM_EPOCHS
  }) {
    model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE),
      loss: 'meanSquaredError'
    })
    this.trainingState[modelName] = 'Training'
    await model.fit(tensors.trainFeatures, tensors.trainTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          runInAction(() => {
            this.currentEpoch[modelName] = epoch
            this.trainLogs[modelName].push({ epoch, ...logs })
          })
          if (weightsIllustration) {
            model.layers[0]
              .getWeights()[0]
              .data()
              .then(kernelAsArr => {
                runInAction(() => {
                  this.weightsList[modelName] = describeKernelElements(
                    kernelAsArr,
                    featureDescriptions
                  )
                })
              })
          }
        },
        onTrainEnd: () => {
          const testSetLoss = calculateTestSetLoss(
            model,
            tensors,
            this.BATCH_SIZE
          )
          const {
            finalTrainSetLoss,
            finalValidationSetLoss
          } = calculateFinalLoss(this.trainLogs[modelName])
          runInAction(() => {
            this.model = model
            this.testSetLoss[modelName] = testSetLoss
            this.finalTrainSetLoss[modelName] = finalTrainSetLoss
            this.finalValidationSetLoss[modelName] = finalValidationSetLoss
            this.trainingState[modelName] = 'Trained'
          })
        }
      }
    })
  }

  async fetchBostonFiles(fileInfos) {
    this.bostonDataIsLoading = true
    const [
      trainFeatures,
      trainTarget,
      testFeatures,
      testTarget
    ] = await Promise.all([
      loadCsv('train-data.csv', basePath, csvOptions),
      loadCsv('train-target.csv', basePath, csvOptions),
      loadCsv('test-data.csv', basePath, csvOptions),
      loadCsv('test-target.csv', basePath, csvOptions)
    ])
    const numFeatures = _.size(_.first(trainFeatures))

    // Shuffle as a function with a return value instead of mutate in place
    const [shuffledTrainFeatures, shuffledTrainTarget] = shuffle(
      trainFeatures,
      trainTarget
    )
    const [shuffledTestFeatures, shuffledTestTarget] = shuffle(
      testFeatures,
      testTarget
    )

    // Convert to normalized tensors
    const tensors = arraysToTensors(
      shuffledTrainFeatures,
      shuffledTrainTarget,
      shuffledTestFeatures,
      shuffledTestTarget
    )
    runInAction(() => {
      this.numFeatures = numFeatures
      this.tensors = tensors
      this.bostonDataIsLoading = false
    })
  }
}

decorate(BostonStore, {
  run: action,
  fetchBostonFiles: action,
  tensors: observable,
  numFeatures: observable,
  bostonDataIsLoading: observable,
  currentEpoch: observable,
  trainingState: observable,
  trainLogs: observable,
  weightsList: observable,
  finalTrainSetLoss: observable,
  finalValidationSetLoss: observable,
  testSetLoss: observable,
  model: observable,
  weightsListLinearSorted: computed,
  averagePrice: computed,
  baselineLoss: computed,
  readyToModel: computed
})

export default BostonStore
