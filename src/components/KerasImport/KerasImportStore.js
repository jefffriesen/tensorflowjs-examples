import _ from 'lodash'
import * as tf from '@tensorflow/tfjs'
import { configure, observable, decorate, computed, autorun } from 'mobx'
// import { arraysToTensors } from './utils'
configure({ enforceActions: 'observed' })

const model1Path = 'data/keras_model/countEEOnlyPercent.json'

class KerasImportStore {
  constructor() {
    autorun(() => this.loadKerasModel())
  }

  kerasModel = null

  get modelLoaded() {
    return !_.isEmpty(this.kerasModel)
  }

  async loadKerasModel() {
    // this.kerasModel = await tf.loadLayersModel(model1Path)
    const response = await fetch(model1Path)
    const file = await response.json()
    this.kerasModel = file // this isn't really the keras model, just the json file
  }
}

decorate(KerasImportStore, {
  kerasModel: observable.shallow,
  modelLoaded: computed,
})

export default KerasImportStore
