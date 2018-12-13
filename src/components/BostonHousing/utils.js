import _ from 'lodash'
// import _ from 'lodash'
import Papa from 'papaparse'
import * as tf from '@tensorflow/tfjs'

/**
 * Convert loaded data into tensors and creates normalized versions of the features.
 * @param {*} data
 */
export const arraysToTensors = (
  trainFeaturesArray,
  trainTargetArray,
  testFeaturesArray,
  testTargetArray
) => {
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
 * Load data from local source. This is different than the official example that
 * loads from a remote source. This is nicer and faster.
 * @param {*} data
 */
const parseCsv = data => {
  return data.map(row => {
    return Object.keys(row).map(key => parseFloat(row[key]))
  })
}

export const loadCsv = async (filename, basePath, csvOptions) => {
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
