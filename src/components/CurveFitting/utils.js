import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'

// y = a * x ^ 3 + b * x ^ 2 + c * x + d
export const predict = (x, { a, b, c, d }) => {
  return tf.tidy(() => {
    return a
      .mul(x.pow(tf.scalar(3, 'int32')))
      .add(b.mul(x.square()))
      .add(c.mul(x))
      .add(d)
  })
}

// Having a good error function is key for training a machine learning model
export const loss = (prediction, labels) => {
  const error = prediction
    .sub(labels)
    .square()
    .mean()
  return error
}

export const trainFn = async (
  trainingData,
  trainingCoefficients,
  numIterations,
  optimizer
) => {
  const { xs, ys } = trainingData
  for (let iter = 0; iter < numIterations; iter++) {
    optimizer.minimize(() => {
      const pred = predict(xs, trainingCoefficients)
      return loss(pred, ys)
    })

    // Use tf.nextFrame to not block the browser.
    await tf.nextFrame()
  }
  return trainingCoefficients
}

export const plottableTrainingDataFn = trainingData => {
  const { xs, ys } = trainingData
  const xvals = xs.dataSync()
  const yvals = ys.dataSync()
  const vals = Array.from(yvals).map((y, i) => {
    return { x: _.round(xvals[i], 3), y: _.round(yvals[i], 3) }
  })
  return _.sortBy(vals, ['x'])
}

export const plottablePredictionsFn = (trainingData, preds) => {
  const { xs, ys } = trainingData
  const xvals = xs.dataSync()
  const yvals = ys.dataSync()
  const predVals = preds.dataSync()
  const vals = Array.from(yvals).map((y, i) => {
    return { x: _.round(xvals[i], 3), y: _.round(predVals[i], 3) }
  })
  // If connecting dots by a line, which is nice for predictions,
  // they need to be sorted by x
  return _.sortBy(vals, ['x'])
}

/**
 * Generate curve data given polynomial coefficients
 */
export function generateCurveData(numPoints, coeff, sigma = 0.04) {
  return tf.tidy(() => {
    const [a, b, c, d] = [
      tf.scalar(coeff.a),
      tf.scalar(coeff.b),
      tf.scalar(coeff.c),
      tf.scalar(coeff.d)
    ]

    const xs = tf.randomUniform([numPoints], -1, 1)

    // Generate polynomial data
    const three = tf.scalar(3, 'int32')
    const ys = a
      .mul(xs.pow(three))
      .add(b.mul(xs.square()))
      .add(c.mul(xs))
      .add(d)
      // Add random noise to the generated data
      // to make the problem a bit more interesting
      .add(tf.randomNormal([numPoints], 0, sigma))

    // Normalize the y values to the range 0 to 1.
    const ymin = ys.min()
    const ymax = ys.max()
    const yrange = ymax.sub(ymin)
    const ysNormalized = ys.sub(ymin).div(yrange)

    return {
      xs,
      ys: ysNormalized
    }
  })
}
