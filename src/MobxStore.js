import _ from 'lodash'
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
  fetchFile,
  getHomerStats,
  getSummaryStats,
  calculateNewLoads
} from './utils/homerHelpers'
import { loadCsv } from './utils/bostonHelpers'
import { homerFiles, applianceFiles } from './utils/fileInfo'
import { fieldDefinitions } from './utils/fieldDefinitions'
configure({ enforceActions: 'observed' })

const initHomerPath = './data/homer/12-50 Baseline.csv'
const initAppliancePath = './data/appliances/rice_mill_usage_profile.csv'

class MobxStore {
  constructor() {
    autorun(() => this.fetchHomer(this.activeHomerFileInfo))
    autorun(() => this.fetchAppliance(this.activeApplianceFileInfo))
    autorun(() => this.fetchBostonFiles(this.bostonFilesInfo))
  }

  activeHomer = null
  activeAppliance = null
  activeHomerFileInfo = _.find(homerFiles, { path: initHomerPath })
  activeApplianceFileInfo = _.find(applianceFiles, { path: initAppliancePath })
  homerIsLoading = false
  applianceIsLoading = false
  appCalculating = false

  bostonFiles = {
    testData: null,
    testTarget: null,
    trainData: null,
    trainTarget: null
  }

  // Model inputs must have a definition in the fieldDefinitions file
  modelInputs = {
    kwFactorToKw: fieldDefinitions['kwFactorToKw'].defaultValue,
    dutyCycleDerateFactor: _.get(
      this.activeApplianceFileInfo,
      'defaults.dutyCycleDerateFactor',
      1
    ),
    seasonalDerateFactor: null,
    wholesaleElectricityCost: 5,
    unmetLoadCostPerKwh: 6,
    retailElectricityPrice: 8,
    productionUnitsPerKwh: 5,
    revenuePerProductionUnits: 2,
    revenuePerProductionUnitsUnits: '$ / kg'
  }

  get calculatedColumns() {
    if (_.isEmpty(this.activeHomer) || _.isEmpty(this.activeAppliance)) {
      return null
    }
    return calculateNewLoads({
      homer: this.activeHomer,
      appliance: this.activeAppliance,
      modelInputs: this.modelInputs,
      homerStats: this.homerStats,
      constants: {}
    })
  }

  get homerStats() {
    return _.isEmpty(this.activeHomer) ? null : getHomerStats(this.activeHomer)
  }

  get summaryStats() {
    return _.isEmpty(this.calculatedColumns)
      ? null
      : getSummaryStats(this.calculatedColumns, this.modelInputs)
  }

  async fetchHomer(activeHomerFileInfo) {
    this.homerIsLoading = true
    const homer = await fetchFile(activeHomerFileInfo)
    runInAction(() => {
      this.activeHomer = homer
      this.homerIsLoading = false
    })
  }

  async fetchAppliance(fileInfo) {
    this.applianceIsLoading = true
    const appliance = await fetchFile(fileInfo)
    runInAction(() => {
      this.activeAppliance = appliance
      this.applianceIsLoading = false
    })
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

  // Choose HOMER or Appliance File Form changes
  setActiveHomerFile(event, data) {
    this.activeHomerFileInfo = _.find(homerFiles, {
      path: data.value
    })
  }

  setActiveApplianceFile(event, data) {
    this.activeApplianceFileInfo = _.find(applianceFiles, {
      path: data.value
    })
  }

  // Model Input form change handlers
  onModelInputChange(fieldKey, value) {
    this.modelInputs[fieldKey] = value
  }

  // Boston Housing data
}

decorate(MobxStore, {
  activeHomer: observable,
  activeHomerFileInfo: observable,
  activeAppliance: observable,
  activeApplianceFileInfo: observable,
  homerIsLoading: observable,
  applianceIsLoading: observable,
  // appCalculating: observable,
  modelInputs: observable,
  fetchHomer: action,
  fetchAppliance: action,
  calculatedColumns: computed,
  homerStats: computed,
  summaryStats: computed,
  setActiveHomerFile: action.bound,
  setActiveApplianceFile: action.bound,
  onModelInputChange: action.bound,

  fetchBostonFiles: action,
  bostonFilesInfo: observable,
  bostonFiles: observable
})

export default MobxStore
// export let mobxStore = new MobxStore()
