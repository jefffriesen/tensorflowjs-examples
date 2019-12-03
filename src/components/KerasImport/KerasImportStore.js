import _ from 'lodash'
import * as tf from '@tensorflow/tfjs'
import { configure, observable, decorate, action, computed, runInAction, autorun } from 'mobx'
// import { arraysToTensors } from './utils'
configure({ enforceActions: 'observed' })

const basePath = './data/keras_model/'

/**
 * Boston Housing
 */
class BostonStore {
  constructor() {
    // autorun(() => this.fetchBostonFiles(this.bostonFilesInfo))
  }

  NUM_EPOCHS = 50

  get readyToModel() {
    return !this.bostonDataIsLoading && Boolean(this.numFeatures)
  }

  // async trainLinearRegressor() {
  //   const model = linearRegressionModel(this.numFeatures)
  //   await this.run({
  //     model,
  //     tensors: this.tensors,
  //     modelName: 'linear',
  //     weightsIllustration: true,
  //     LEARNING_RATE: this.LEARNING_RATE,
  //     BATCH_SIZE: this.BATCH_SIZE,
  //     NUM_EPOCHS: this.NUM_EPOCHS,
  //   })
  // }

  // get inputTensorShape() {
  //   return [1, _.size(featureDescriptions)]
  // }

  // get plottablePredictionDataLinear() {
  //   return calculatePlottablePredictedVsActualData(
  //     this.trainingData,
  //     this.model['linear'],
  //     this.inputTensorShape
  //   )
  // }
}

decorate(BostonStore, {
  // run: action,
  // fetchBostonFiles: action,
  // trainingData: observable,
  // tensors: observable,
  // numFeatures: observable,
  // inputTensorShape: computed,
  // plottablePredictionDataLinear: computed,
  // plottablePredictionData1Hidden: computed,
  // plottablePredictionData2Hidden: computed,
  // plottableReferenceLine: computed,
  // bostonDataIsLoading: observable,
  // currentEpoch: observable,
  // trainingState: observable,
  // trainLogs: observable,
  // weightsList: observable,
  // finalTrainSetLoss: observable,
  // finalValidationSetLoss: observable,
  // testSetLoss: observable,
  // model: observable,
  // weightsListLinearSorted: computed,
  // averagePrice: computed,
  // baselineLoss: computed,
  // readyToModel: computed,
})

export default BostonStore
