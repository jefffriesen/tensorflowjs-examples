// import _ from 'lodash'
import * as tf from '@tensorflow/tfjs'
import { configure, observable, decorate, autorun } from 'mobx'
configure({ enforceActions: 'observed' })

const countEEOnlyPercentPath = 'data/tfjs_models/countEEOnlyPercent/model.json'
const row2 = [0.1, 0.2, 1.8, 1.1, 0.5, 1000, 1.2, 24] // 0 0 0
// const result2_1 = [0]
// const result2_2 = [0]
// const result2_3 = [0]

const row99169 = [0.1, 0.2, 1.8, 1.1, 0.5, 1000, 1.2, 24] // 7 58	100
// const result99169_1 = [7]
// const result99169_2 = [58]
// const result99169_3 = [100]

const row99171 = [0.14, 1, 3.4, 1.5, 0.9, 7000, 1.2, 240] // 21 99 100
// const result99171_1 = [21]
// const result99171_2 = [99]
// const result99171_3 = [100]

class KerasImportStore {
  constructor() {
    autorun(() => this.loadKerasModel())
  }

  countEEOnlyPercentModel = null
  modelIsLoaded = false

  async loadKerasModel() {
    this.countEEOnlyPercentModel = await tf.loadLayersModel(countEEOnlyPercentPath)

    const inputs = tf.tensor2d([row2, row99169, row99171])
    const prediction = this.countEEOnlyPercentModel.predict(inputs).dataSync()
    console.log('prediction: ', prediction) // incorrect prediction: does it need to be normalized?

    this.modelIsLoaded = true
  }
}

decorate(KerasImportStore, {
  modelIsLoaded: observable,
})

export default KerasImportStore
