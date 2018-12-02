// import _ from 'lodash'
import * as tf from '@tensorflow/tfjs'
import {
  configure,
  observable,
  decorate,
  // action,
  // runInAction,
  computed
  // autorun
} from 'mobx'
import {
  predict,
  plottableDataFn,
  plottableDataAndPredictionsFn,
  generateCurveData
} from './utils'
configure({ enforceActions: 'observed' })

/**
 * Fit curve to synthetic data
 * https://github.com/tensorflow/tfjs-examples/tree/master/polynomial-regression-core
 */

/**
 * Imperative, mutaty tensorflow code translation:
 * 1. Create polynomial with known coefficients
 * 2. Create random coefficients to the polynomial as mutable tf *variables*
 * 3. Build predict and loss functions
 * 4. Build async training function
 * 5. learnCoefficients:
 * ** Create 2 sets of tf variables: one that we mutate and one that we don't
 * (then wouldn't I just make one of them a regular tensor)
 * ** Output the immutable coefficients
 * ** Create async train function that takes variables, iterates, and returns the result
 */

class CurveStore {
  trueCoefficients = { a: -0.8, b: -0.2, c: 0.9, d: 0.5 }
  trainedCoefficients = {
    a: tf.variable(tf.scalar(Math.random())),
    b: tf.variable(tf.scalar(Math.random())),
    c: tf.variable(tf.scalar(Math.random())),
    d: tf.variable(tf.scalar(Math.random()))
  }
  numIterations = 75
  learningRate = 0.5
  optimizer = tf.train.sgd(this.learningRate)

  get trainingData() {
    return generateCurveData(100, this.trueCoefficients)
  }

  get predictionsBefore() {
    // predict(this.trainingData.xs)
    return null
  }

  get predictionsAfter() {
    // predict(this.trainingData.xs)
    return null
  }

  get plottableData() {
    return plottableDataFn(this.trainingData.xs, this.trainingData.ys)
  }

  get plottableDataAndPredictionBefore() {
    return plottableDataAndPredictionsFn(
      this.trainingData.xs,
      this.trainingData.ys,
      this.predictionsBefore
    )
  }

  get plottableDataAndPredictionAfter() {
    return plottableDataAndPredictionsFn(
      this.trainingData.xs,
      this.trainingData.ys,
      this.predictionsAfter
    )
  }
}

decorate(CurveStore, {
  trueCoefficients: observable,
  trainingData: computed,
  predictionsBefore: computed,
  predictionsAfter: computed,
  plottableData: computed,
  plottableDataAndPredictionBefore: computed,
  plottableDataAndPredictionAfter: computed
})

export default CurveStore
