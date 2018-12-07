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
  // '...Vals' are plain numbers instead of tensors
  seedCoefficientVals = {
    a: Math.random(),
    b: Math.random(),
    c: Math.random(),
    d: Math.random()
  }
  trueCoefficientVals = { a: -0.8, b: -0.2, c: 0.9, d: 0.5 }

  // seedCoefficients and trainedCoefficients are tensor variables
  seedCoefficients = {
    a: tf.variable(tf.scalar(this.seedCoefficientVals.a)),
    b: tf.variable(tf.scalar(this.seedCoefficientVals.b)),
    c: tf.variable(tf.scalar(this.seedCoefficientVals.c)),
    d: tf.variable(tf.scalar(this.seedCoefficientVals.d))
  }
  // These will be mutated. This can probably be cloned from seedCoefficients
  trainedCoefficients = {
    a: tf.variable(tf.scalar(this.seedCoefficientVals.a)),
    b: tf.variable(tf.scalar(this.seedCoefficientVals.b)),
    c: tf.variable(tf.scalar(this.seedCoefficientVals.c)),
    d: tf.variable(tf.scalar(this.seedCoefficientVals.d))
  }
  numIterations = 75
  learningRate = 0.5
  optimizer = tf.train.sgd(this.learningRate)

  // May have to break this out into different functions:
  // 1. trainingDataCuve
  // 2. predictedDataCurve
  get trainingData() {
    return generateCurveData(100, this.trueCoefficientVals)
  }

  get plottableTrainingData() {
    return plottableDataFn(this.trainingData.xs, this.trainingData.ys)
  }

  get predictionsBeforeTrainingData() {
    return predict(this.trainingData.xs, this.seedCoefficients)
  }

  get plottablePredictionsBeforeTraining() {
    return plottableDataAndPredictionsFn(
      this.trainingData.xs,
      this.trainingData.ys,
      this.predictionsBeforeTrainingData
    )
  }

  // get predictionsAfterTraining() {
  //   // predict(this.trainingData.xs)
  //   return null
  // }

  // get plottableDataAndPredictionAfter() {
  //   return plottableDataAndPredictionsFn(
  //     this.trainingData.xs,
  //     this.trainingData.ys,
  //     this.predictionsAfterTraining
  //   )
  // }
}

decorate(CurveStore, {
  trueCoefficientVals: observable,
  trainingData: computed,
  plottableTrainingData: computed,
  predictionsBeforeTrainingData: computed,
  plottablePredictionsBeforeTraining: computed
  // predictionsAfterTraining: computed,
  // plottableDataAndPredictionBefore: computed,
  // plottableDataAndPredictionAfter: computed
})

export default CurveStore
