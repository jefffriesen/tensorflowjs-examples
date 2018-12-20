import _ from 'lodash'
import Papa from 'papaparse'
import * as tf from '@tensorflow/tfjs'

/**
 * Builds and returns Linear Regression Model.
 *
 * @returns {tf.Sequential} The linear regression model.
 */
export function linearRegressionModel(numFeatures) {
  const model = tf.sequential()
  model.add(tf.layers.dense({ inputShape: [numFeatures], units: 1 }))
  model.summary()
  return model
}

/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 1 hidden layers, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression model.
 */
export function multiLayerPerceptronRegressionModel1Hidden(numFeatures) {
  const model = tf.sequential()
  model.add(
    tf.layers.dense({
      inputShape: [numFeatures],
      units: 50,
      activation: 'sigmoid',
      kernelInitializer: 'leCunNormal'
    })
  )
  model.add(tf.layers.dense({ units: 1 }))
  model.summary()
  return model
}

/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 2 hidden layers, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression mode  l.
 */
export function multiLayerPerceptronRegressionModel2Hidden(numFeatures) {
  const model = tf.sequential()
  model.add(
    tf.layers.dense({
      inputShape: [numFeatures],
      units: 50,
      activation: 'sigmoid',
      kernelInitializer: 'leCunNormal'
    })
  )
  model.add(
    tf.layers.dense({
      units: 50,
      activation: 'sigmoid',
      kernelInitializer: 'leCunNormal'
    })
  )
  model.add(tf.layers.dense({ units: 1 }))
  model.summary()
  return model
}

export function calculateTestSetLoss(model, tensors, BATCH_SIZE) {
  const testSetLoss = model.evaluate(tensors.testFeatures, tensors.testTarget, {
    batchSize: BATCH_SIZE
  })
  return _.round(testSetLoss.dataSync()[0])
}

export function calculateFinalLoss(trainLogs, model, BATCH_SIZE) {
  const finalTrainSetLoss = trainLogs[trainLogs.length - 1].loss
  const finalValidationSetLoss = trainLogs[trainLogs.length - 1].val_loss
  return {
    finalTrainSetLoss: _.round(finalTrainSetLoss, 2),
    finalValidationSetLoss: _.round(finalValidationSetLoss, 2)
  }
}

/**
 * Convert loaded data into tensors and creates normalized versions of the features.
 * @param {*} data
 */
export function arraysToTensors(
  trainFeaturesArray,
  trainTargetArray,
  testFeaturesArray,
  testTargetArray
) {
  let rawTrainFeatures = tf.tensor2d(trainFeaturesArray)
  let trainTarget = tf.tensor2d(trainTargetArray)
  let rawTestFeatures = tf.tensor2d(testFeaturesArray)
  let testTarget = tf.tensor2d(testTargetArray)

  // Normalize mean and standard deviation of data.
  let { dataMean, dataStd } = determineMeanAndStddev(rawTrainFeatures)

  return {
    trainFeatures: normalizeTensor(rawTrainFeatures, dataMean, dataStd),
    trainTarget,
    testFeatures: normalizeTensor(rawTestFeatures, dataMean, dataStd),
    testTarget
  }
}

/**
 * Describe the current linear weights for a human to read.
 *
 * @param {Array} kernel Array of floats of length 12.  One value per feature.
 * @returns {List} List of objects, each with a string feature name, and value
 *     feature weight.
 */
export function describeKernelElements(kernel, featureDescriptions) {
  const kernelSize = featureDescriptions.length
  tf.util.assert(
    kernel.length === kernelSize,
    `kernel must match featureDescriptions, got ${kernelSize}`
  )
  return _.map(kernel, (kernalValue, index) => {
    return {
      description: featureDescriptions[index],
      value: _.round(kernalValue, 2)
    }
  })
}

export function computeAveragePrice(tensors) {
  return _.round(tf.mean(tensors.trainTarget).dataSync()[0], 2)
}

export function computeBaselineLoss(tensors) {
  const averagePrice = tf.mean(tensors.trainTarget)
  const baseline = tf.mean(tf.pow(tf.sub(tensors.testTarget, averagePrice), 2))
  return _.round(baseline.dataSync()[0])
}

/**
 * Calculates the mean and standard deviation of each column of a data array.
 *
 * @param {Tensor2d} data Dataset from which to calculate the mean and
 *                        std of each column independently.
 *
 * @returns {Object} Contains the mean and standard deviation of each vector
 *                   column as 1d tensors.
 */
export function determineMeanAndStddev(data) {
  const dataMean = data.mean(0)
  const diffFromMean = data.sub(dataMean)
  const squaredDiffFromMean = diffFromMean.square()
  const variance = squaredDiffFromMean.mean(0)
  const dataStd = variance.sqrt()
  return { dataMean, dataStd }
}

/**
 * Given expected mean and standard deviation, normalizes a dataset by
 * subtracting the mean and dividing by the standard deviation.
 *
 * @param {Tensor2d} data: Data to normalize. Shape: [batch, numFeatures].
 * @param {Tensor1d} dataMean: Expected mean of the data. Shape [numFeatures].
 * @param {Tensor1d} dataStd: Expected std of the data. Shape [numFeatures]
 *
 * @returns {Tensor2d}: Tensor the same shape as data, but each column
 * normalized to have zero mean and unit standard deviation.
 */
export function normalizeTensor(data, dataMean, dataStd) {
  return data.sub(dataMean).div(dataStd)
}

/**
 * Shuffles data and target (maintaining alignment) using Fisher-Yates
 * algorithm
 * The original function mutate the data in place.
 * I've converted it to return a value. Needs a test
 * Pass in array of arrays
 */
export function shuffle(dataOrig, targetOrig) {
  let data = _.cloneDeep(dataOrig)
  let target = _.cloneDeep(targetOrig)
  let counter = data.length
  let temp = 0
  let index = 0
  while (counter > 0) {
    index = (Math.random() * counter) | 0
    counter--
    // data:
    temp = data[counter]
    data[counter] = data[index]
    data[index] = temp
    // target:
    temp = target[counter]
    target[counter] = target[index]
    target[index] = temp
  }
  return [data, target]
}

/**
 * Load data from local source. This is different than the official example that
 * loads from a remote source. This is nicer and faster.
 * @param {*} data
 */
function parseCsv(data) {
  return data.map(row => {
    return Object.keys(row).map(key => parseFloat(row[key]))
  })
}

export async function loadCsv(filename, basePath, csvOptions) {
  const path = `${basePath}${filename}`
  try {
    const res = await window.fetch(path)
    const csv = await res.text()
    const { data, errors } = Papa.parse(csv, csvOptions)
    if (!_.isEmpty(errors)) {
      throw new Error(`Problem parsing CSV: ${JSON.stringify(errors)}`)
    }
    return parseCsv(data)
  } catch (error) {
    console.error(
      `File load fail for : ${filename}. Make sure CSV has all headers.`,
      error
    )
  }
}
