import _ from 'lodash'
// import _ from 'lodash'
import Papa from 'papaparse'
import * as tf from '@tensorflow/tfjs'

export const featureDescriptions = [
  'Crime rate',
  'Land zone size',
  'Industrial proportion',
  'Next to river',
  'Nitric oxide concentration',
  'Number of rooms per house',
  'Age of housing',
  'Distance to commute',
  'Distance to highway',
  'Tax rate',
  'School class size',
  'School drop-out rate'
]

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
export function describeKerenelElements(kernel) {
  tf.util.assert(
    kernel.length == 12,
    `kernel must be a array of length 12, got ${kernel.length}`
  )
  // TODO: functionalize this
  const outList = []
  for (let idx = 0; idx < kernel.length; idx++) {
    outList.push({ description: featureDescriptions[idx], value: kernel[idx] })
  }
  return outList
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
