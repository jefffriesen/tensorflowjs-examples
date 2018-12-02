import * as tf from '@tensorflow/tfjs'
import renderChart from 'vega-embed'

/**
 * We want to learn the coefficients that give correct solutions to the
 * following cubic equation:
 *      y = a * x^3 + b * x^2 + c * x + d
 * In other words we want to learn values for:
 *      a
 *      b
 *      c
 *      d
 * Such that this function produces 'desired outputs' for y when provided
 * with x. We will provide some examples of 'xs' and 'ys' to allow this model
 * to learn what we mean by desired outputs and then use it to produce new
 * values of y that fit the curve implied by our example.
 */

// Step 1. Set up variables, these are the things we want the model
// to learn in order to do prediction accurately. We will initialize
// them with random values.
const a = tf.variable(tf.scalar(Math.random()))
const b = tf.variable(tf.scalar(Math.random()))
const c = tf.variable(tf.scalar(Math.random()))
const d = tf.variable(tf.scalar(Math.random()))

// Step 2. Create an optimizer, we will use this later. You can play
// with some of these values to see how the model performs.
const numIterations = 75
const learningRate = 0.5
const optimizer = tf.train.sgd(learningRate)

// Step 3. Write our training process functions.
/*
 * This function represents our 'model'. Given an input 'x' it will try and
 * predict the appropriate output 'y'.
 *
 * It is also sometimes referred to as the 'forward' step of our training
 * process. Though we will use the same function for predictions later.
 *
 * @return number predicted y value
 */
export const predict = x => {
  // y = a * x ^ 3 + b * x ^ 2 + c * x + d
  return tf.tidy(() => {
    return a
      .mul(x.pow(tf.scalar(3, 'int32')))
      .add(b.mul(x.square()))
      .add(c.mul(x))
      .add(d)
  })
}

/*
 * This will tell us how good the 'prediction' is given what we actually
 * expected.
 *
 * prediction is a tensor with our predicted y values.
 * labels is a tensor with the y values the model should have predicted.
 */
export const loss = (prediction, labels) => {
  // Having a good error function is key for training a machine learning model
  const error = prediction
    .sub(labels)
    .square()
    .mean()
  return error
}

/*
 * This will iteratively train our model.
 *
 * xs - training data x values
 * ys — training data y values
 */
async function train(xs, ys, numIterations) {
  for (let iter = 0; iter < numIterations; iter++) {
    // optimizer.minimize is where the training happens.

    // The function it takes must return a numerical estimate (i.e. loss)
    // of how well we are doing using the current state of
    // the variables we created at the start.

    // This optimizer does the 'backward' step of our training process
    // updating variables defined previously in order to minimize the
    // loss.
    optimizer.minimize(() => {
      // Feed the examples into the model
      const pred = predict(xs)
      return loss(pred, ys)
    })

    // Use tf.nextFrame to not block the browser.
    await tf.nextFrame()
  }
}

async function learnCoefficients() {
  const trueCoefficients = { a: -0.8, b: -0.2, c: 0.9, d: 0.5 }
  const trainingData = generateCurveData(100, trueCoefficients)

  // Plot original data
  renderCoefficients('#data .coeff', trueCoefficients)
  await plotData('#data .plot', trainingData.xs, trainingData.ys)

  // See what the predictions look like with random coefficients
  renderCoefficients('#random .coeff', {
    a: a.dataSync()[0],
    b: b.dataSync()[0],
    c: c.dataSync()[0],
    d: d.dataSync()[0]
  })
  const predictionsBefore = predict(trainingData.xs)
  await plotDataAndPredictions(
    '#random .plot',
    trainingData.xs,
    trainingData.ys,
    predictionsBefore
  )

  // Train the model!
  await train(trainingData.xs, trainingData.ys, numIterations)

  // See what the final results predictions are after training.
  renderCoefficients('#trained .coeff', {
    a: a.dataSync()[0],
    b: b.dataSync()[0],
    c: c.dataSync()[0],
    d: d.dataSync()[0]
  })
  const predictionsAfter = predict(trainingData.xs)
  await plotDataAndPredictions(
    '#trained .plot',
    trainingData.xs,
    trainingData.ys,
    predictionsAfter
  )

  predictionsBefore.dispose()
  predictionsAfter.dispose()
}

// learnCoefficients()

/**
 * Generate Data
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

/**
 * Old plotting examples
 */
export async function plotData(container, xs, ys) {
  const xvals = await xs.data()
  const yvals = await ys.data()

  const values = Array.from(yvals).map((y, i) => {
    return { x: xvals[i], y: yvals[i] }
  })

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
    width: 300,
    height: 300,
    data: { values: values },
    mark: 'point',
    encoding: {
      x: { field: 'x', type: 'quantitative' },
      y: { field: 'y', type: 'quantitative' }
    }
  }

  return renderChart(container, spec, { actions: false })
}

export async function plotDataAndPredictions(container, xs, ys, preds) {
  const xvals = await xs.data()
  const yvals = await ys.data()
  const predVals = await preds.data()

  const values = Array.from(yvals).map((y, i) => {
    return { x: xvals[i], y: yvals[i], pred: predVals[i] }
  })

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
    width: 300,
    height: 300,
    data: { values: values },
    layer: [
      {
        mark: 'point',
        encoding: {
          x: { field: 'x', type: 'quantitative' },
          y: { field: 'y', type: 'quantitative' }
        }
      },
      {
        mark: 'line',
        encoding: {
          x: { field: 'x', type: 'quantitative' },
          y: { field: 'pred', type: 'quantitative' },
          color: { value: 'tomato' }
        }
      }
    ]
  }

  return renderChart(container, spec, { actions: false })
}

export function renderCoefficients(container, coeff) {
  document.querySelector(container).innerHTML = `<span>a=${coeff.a.toFixed(
    3
  )}, b=${coeff.b.toFixed(3)}, c=${coeff.c.toFixed(3)},  d=${coeff.d.toFixed(
    3
  )}</span>`
}
