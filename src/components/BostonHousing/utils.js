import _ from 'lodash'
import Papa from 'papaparse'

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
    // console.log('data: ', path, data)
    // console.log('parsed data: ', path, parseCsv(data))
    return parseCsv(data)
  } catch (error) {
    console.error(
      `File load fail for : ${filename}. Make sure CSV has all headers.`,
      error
    )
  }
}

/**
 * Original fetch and parse implementation fetching from remote server.
 * Much nicer during development to fetch data locally
 */
// const BASE_URL =
//   'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/'

// const parseCsv = async data => {
//   return new Promise(resolve => {
//     data = data.map(row => {
//       return Object.keys(row).map(key => parseFloat(row[key]))
//     })
//     resolve(data)
//   })
// }

// export const loadCsv = async filename => {
//   return new Promise(resolve => {
//     const url = `${BASE_URL}${filename}`
//     console.log(`  * Downloading data from: ${url}`)
//     Papa.parse(url, {
//       download: true,
//       header: true,
//       complete: results => {
//         resolve(parseCsv(results['data']))
//       }
//     })
//   })
// }
