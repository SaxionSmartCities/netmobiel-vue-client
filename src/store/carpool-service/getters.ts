import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { CarpoolState } from '@/store/carpool-service/types'

// @ts-ignore
const csBuilder: ModuleBuilder = getStoreBuilder().module('cs')

const getAvailableCars = csBuilder.read((state: CarpoolState) => {
  return state.cars
}, 'getAvailableCars')

const getRides = csBuilder.read((state: CarpoolState) => {
  return state.rides
}, 'getRides')

const getSelectedRide = csBuilder.read((state: CarpoolState) => {
  return state.selectedRide
}, 'getSelectedRide')

const getPlannedRidesCount = csBuilder.read((state: CarpoolState) => {
  return state.plannedRidesCount
}, 'getPlannedRidesCount')

const getSearchResult = csBuilder.read((state: CarpoolState) => {
  return state.search.result
}, 'getSearchResult')

const getSearchLicensePlate = csBuilder.read((state: CarpoolState) => {
  return state.search.licensePlate
}, 'getSearchLicensePlate')

export default {
  get getAvailableCars() {
    return getAvailableCars()
  },
  get getRides() {
    return getRides()
  },
  get getSelectedRide() {
    return getSelectedRide()
  },
  get getPlannedRidesCount() {
    return getPlannedRidesCount()
  },
  get getSearchResult() {
    return getSearchResult()
  },
  get getSearchLicensePlate() {
    return getSearchLicensePlate()
  },
}
