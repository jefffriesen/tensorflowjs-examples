// import _ from 'lodash'
import {
  configure,
  observable,
  decorate
  // action,
  // runInAction,
  // computed,
  // autorun
} from 'mobx'
import { generateCurveData } from '../CurveFitting/utils'
configure({ enforceActions: 'observed' })

/**
 * Fit curve to synthetic data
 * https://github.com/tensorflow/tfjs-examples/tree/master/polynomial-regression-core
 */
class CurveStore {
  trueCoefficients = { a: -0.8, b: -0.2, c: 0.9, d: 0.5 }

  get trainingCurveData() {
    return generateCurveData(100, this.trueCoefficients)
  }
}

decorate(CurveStore, {
  trueCoefficients: observable
})

export default CurveStore
