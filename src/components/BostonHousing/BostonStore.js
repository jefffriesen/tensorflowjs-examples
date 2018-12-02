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
import { loadCsv } from '../BostonHousing/bostonHelpers'
configure({ enforceActions: 'observed' })

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
      loadCsv('train-data.csv'),
      loadCsv('train-target.csv'),
      loadCsv('test-data.csv'),
      loadCsv('test-target.csv')
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
