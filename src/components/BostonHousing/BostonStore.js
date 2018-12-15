import _ from 'lodash'
import * as tf from '@tensorflow/tfjs'
import {
  configure,
  observable,
  decorate,
  action,
  runInAction,
  autorun
} from 'mobx'
import {
  loadCsv,
  arraysToTensors,
  shuffle,
  linearRegressionModel,
  describeKernelElements
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

// How to update a chart during training: (callback)
// const callbacks = tfvis.show.fitCallbacks(container, metrics);
//           return train(model, data, callbacks);
// Another option is to wait for the training to complete and render the loss curve when it is done.
// https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html

class BostonStore {
  constructor() {
    autorun(() => this.fetchBostonFiles(this.bostonFilesInfo))
  }

  NUM_EPOCHS = 200
  BATCH_SIZE = 40
  LEARNING_RATE = 0.01
  tensors = {}
  numFeatures = null
  bostonDataIsLoading = true
  isTraining = {
    linear: false
  }
  currentEpochValue = {
    linear: 0
  }
  trainLogs = {
    linear: []
  }
  weightsList = {
    linear: []
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

  // The reason this complicated function is in the store is because it wiil
  // update the UI by saving out an obervable as it trains. Since it's in the
  // store I could just reference all of the store values like BATCH_SIZE intead
  // of passing them in. I prefer to explicitly pass them in though since it
  // makes a clearer and more testable function. But this function has side effects

  // I could put this in utils and then just pass in this.currentEpochValue and trainLogs
  // TODO: Move compile step into trainLinearRegressor?
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
    this.isTraining[modelName] = true
    await model.fit(tensors.trainFeatures, tensors.trainTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          runInAction(() => {
            this.currentEpochValue[modelName] = epoch
            this.trainLogs[modelName].push(logs)
            // tfvis.show.history(container, trainLogs, ['loss', 'val_loss'])
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
        onTrainEnd: (a, b) => {
          console.log('onTrainEnd: ', a, b)
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
  currentEpochValue: observable,
  trainLogs: observable,
  weightsList: observable
})

export default BostonStore
