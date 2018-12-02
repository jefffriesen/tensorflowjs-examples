// import _ from 'lodash'
import Papa from 'papaparse'

const BASE_URL =
  'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/'

const parseCsv = async data => {
  return new Promise(resolve => {
    data = data.map(row => {
      return Object.keys(row).map(key => parseFloat(row[key]))
    })
    resolve(data)
  })
}

export const loadCsv = async filename => {
  return new Promise(resolve => {
    const url = `${BASE_URL}${filename}`
    console.log(`  * Downloading data from: ${url}`)
    Papa.parse(url, {
      download: true,
      header: true,
      complete: results => {
        resolve(parseCsv(results['data']))
      }
    })
  })
}
