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
 * Imperative tensorflow code translation:
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
    // autorun will rerun if any of the arguments change
    autorun(() =>
      this.train(
        this.seedCoefficientVals,
        this.trainingData,
        this.numIterations,
        this.optimizer
      )
    )
  }

  seedCoefficientVals = {
    a: _.round(Math.random(), 2), // 0.1,
    b: _.round(Math.random(), 2), // 0.2,
    c: _.round(Math.random(), 2), // 0.3,
    d: _.round(Math.random(), 2) // 0.4
  }
  trueCoefficientVals = { a: -0.8, b: -0.2, c: 0.9, d: 0.5 }

  // seedCoefficients and trainedCoefficients are tensor variables.
  seedCoefficients = {
    a: tf.variable(tf.scalar(this.seedCoefficientVals.a)),
    b: tf.variable(tf.scalar(this.seedCoefficientVals.b)),
    c: tf.variable(tf.scalar(this.seedCoefficientVals.c)),
    d: tf.variable(tf.scalar(this.seedCoefficientVals.d))
  }

  // Make a copy of seedCoefficients otherwise they will be mutated during training
  // That's not nice in general, but it's especially bad since it's an observable
  // and any observers will updated as it mutates (depending on throttling)
  trainedCoefficients = {}

  // Model parameters. Could be made adjustable
  numIterations = 125 // 100-200 is best fit
  learningRate = 0.5
  optimizer = tf.train.sgd(this.learningRate)
  isTraining = true

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

  // Create a copy of the seed coefficients, otherwise tensorflow will mutate
  // them inside the minimize() function
  async train(seedCoefficientVals, trainingData, numIterations, optimizer) {
    this.isTraining = true
    let trainingCoefficents = {
      a: tf.variable(tf.scalar(seedCoefficientVals.a)),
      b: tf.variable(tf.scalar(seedCoefficientVals.b)),
      c: tf.variable(tf.scalar(seedCoefficientVals.c)),
      d: tf.variable(tf.scalar(seedCoefficientVals.d))
    }
    const trainedCoefficients = await trainFn(
      trainingData,
      trainingCoefficents,
      numIterations,
      optimizer
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
    if (this.isTraining) {
      return null
    } else {
      return {
        a: _.round(this.trainedCoefficients.a.dataSync()[0], 2),
        b: _.round(this.trainedCoefficients.b.dataSync()[0], 2),
        c: _.round(this.trainedCoefficients.c.dataSync()[0], 2),
        d: _.round(this.trainedCoefficients.d.dataSync()[0], 2)
      }
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
