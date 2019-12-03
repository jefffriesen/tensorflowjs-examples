import _ from 'lodash'
import * as tf from '@tensorflow/tfjs'
import { configure, observable, decorate, computed, autorun } from 'mobx'
// import { arraysToTensors } from './utils'
configure({ enforceActions: 'observed' })

const model1Path = 'data/tfjs_models/countEEOnlyPercent/model.json'

class KerasImportStore {
  constructor() {
    autorun(() => this.loadKerasModel())
  }

  kerasModel = null
  modelIsLoaded = false

  get modelLoaded() {
    return !_.isEmpty(this.kerasModel)
  }

  async loadKerasModel() {
    this.kerasModel = await tf.loadLayersModel(model1Path)
    this.modelIsLoaded = true
  }
}

decorate(KerasImportStore, {
  // kerasModel: observable,
  // modelLoaded: computed,
  modelIsLoaded: observable,
})

export default KerasImportStore
