// import _ from 'lodash'
import {
  configure,
  observable,
  decorate,
  action,
  runInAction,
  // computed,
  autorun
} from 'mobx'
import { loadCsv } from './utils'
configure({ enforceActions: 'observed' })

const basePath = './data/boston_housing/'
const csvOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  delimiter: ','
}

/**
 * Boston Housing
 */
class BostonStore {
  constructor() {
    autorun(() => this.fetchBostonFiles(this.bostonFilesInfo))
  }

  bostonFiles = {
    testData: null,
    testTarget: null,
    trainData: null,
    trainTarget: null
  }

  async fetchBostonFiles(fileInfos) {
    const [
      trainFeatures,
      trainTarget,
      testFeatures,
      testTarget
    ] = await Promise.all([
      loadCsv('train-data.csv', basePath, csvOptions),
      loadCsv('train-target.csv', basePath, csvOptions),
      loadCsv('test-data.csv', basePath, csvOptions),
      loadCsv('test-target.csv', basePath, csvOptions)
    ])
    runInAction(() => {
      this.bostonFiles = {
        trainFeatures,
        trainTarget,
        testFeatures,
        testTarget
      }
      this.bostonIsLoading = false
    })
  }
}

decorate(BostonStore, {
  fetchBostonFiles: action,
  bostonFilesInfo: observable,
  bostonFiles: observable
})

export default BostonStore
