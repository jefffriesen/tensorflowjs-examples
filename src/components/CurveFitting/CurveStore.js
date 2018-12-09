import _ from 'lodash'
import * as tf from '@tensorflow/tfjs'
import {
  configure,
  observable,
  decorate,
  action,
  runInAction,
  computed,
  autorun
} from 'mobx'
import {
  predict,
  plottableTrainingDataFn,
  plottablePredictionsFn,
  generateCurveData,
  trainFn
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
  constructor() {
    autorun(() => this.train(this.trainedCoefficients))
  }

  // '...Vals' are plain numbers instead of tensors
  seedCoefficientVals = {
    a: 0.1, // Math.random(),
    b: 0.2, // Math.random(),
    c: 0.3, // Math.random(),
    d: 0.4 // Math.random()
  }
  // seedCoefficientVals = {
  //   a: Math.random(),
  //   b: Math.random(),
  //   c: Math.random(),
  //   d: Math.random()
  // }
  trueCoefficientVals = { a: -0.8, b: -0.2, c: 0.9, d: 0.5 }

  // seedCoefficients and trainedCoefficients are tensor variables.
  seedCoefficients = {
    a: tf.variable(tf.scalar(this.seedCoefficientVals.a)),
    b: tf.variable(tf.scalar(this.seedCoefficientVals.b)),
    c: tf.variable(tf.scalar(this.seedCoefficientVals.c)),
    d: tf.variable(tf.scalar(this.seedCoefficientVals.d))
  }
  // These will be mutated during training.
  // This can probably be cloned from seedCoefficients
  trainedCoefficients = {
    a: tf.variable(tf.scalar(this.seedCoefficientVals.a)),
    b: tf.variable(tf.scalar(this.seedCoefficientVals.b)),
    c: tf.variable(tf.scalar(this.seedCoefficientVals.c)),
    d: tf.variable(tf.scalar(this.seedCoefficientVals.d))
  }
  numIterations = 75
  learningRate = 0.5
  optimizer = tf.train.sgd(this.learningRate)
  isTraining = true

  // May have to break this out into different functions:
  // 1. trainingDataCuve
  // 2. predictedDataCurve
  get trainingData() {
    return generateCurveData(100, this.trueCoefficientVals)
  }

  get plottableTrainingData() {
    return plottableTrainingDataFn(this.trainingData)
  }

  get predictionsBeforeTraining() {
    return predict(this.trainingData.xs, this.seedCoefficients)
  }

  get plottablePredictionsBeforeTraining() {
    return plottablePredictionsFn(
      this.trainingData,
      this.predictionsBeforeTraining
    )
  }

  async train(coeff) {
    this.isTraining = true
    if (_.isEmpty(this.trainedCoefficients)) {
      return null
    }
    const trainedCoefficients = await trainFn(
      this.trainingData,
      this.trainedCoefficients,
      this.numIterations,
      this.optimizer
    )
    runInAction(() => {
      this.trainedCoefficients = trainedCoefficients
      this.isTraining = false
    })
  }

  get predictionsAfterTraining() {
    if (this.isTraining) {
      return null
    } else {
      return predict(this.trainingData.xs, this.trainedCoefficients)
    }
  }

  get plottablePredictionsAfterTraining() {
    if (!this.predictionsAfterTraining) {
      return null
    } else {
      return plottablePredictionsFn(
        this.trainingData,
        this.predictionsAfterTraining
      )
    }
  }

  get trainedCoefficientVals() {
    return {
      a: _.round(this.trainedCoefficients.a.dataSync()[0], 2),
      b: _.round(this.trainedCoefficients.b.dataSync()[0], 2),
      c: _.round(this.trainedCoefficients.c.dataSync()[0], 2),
      d: _.round(this.trainedCoefficients.d.dataSync()[0], 2)
    }
  }
}

decorate(CurveStore, {
  isTraining: observable,
  trueCoefficientVals: observable,
  trainedCoefficientVals: computed,
  trainingData: computed,
  plottableTrainingData: computed,
  predictionsBeforeTraining: computed,
  plottablePredictionsBeforeTraining: computed,
  train: action,
  predictionsAfterTraining: computed,
  plottablePredictionsAfterTraining: computed
})

export default CurveStore
