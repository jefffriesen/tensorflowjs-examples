// import _ from 'lodash'
// import * as tf from '@tensorflow/tfjs'
import {
  configure,
  observable,
  decorate,
  action,
  runInAction,
  // computed,
  autorun
} from 'mobx'
import { loadCsv, arraysToTensors } from './utils'
configure({ enforceActions: 'observed' })

const basePath = './data/boston_housing/'
const csvOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  delimiter: ','
}

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
  bostonDataIsLoading = true

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
    const tensors = arraysToTensors(
      trainFeatures,
      trainTarget,
      testFeatures,
      testTarget
    )
    runInAction(() => {
      this.tensors = tensors
      this.bostonDataIsLoading = false
    })
  }
}

decorate(BostonStore, {
  fetchBostonFiles: action,
  // bostonFilesInfo: observable,
  tensors: observable
})

export default BostonStore
