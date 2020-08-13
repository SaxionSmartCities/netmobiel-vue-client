import { ModuleBuilder } from 'vuex-typex'
import { CarpoolState } from '@/store/carpool-service/types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  csBuilder: ModuleBuilder<CarpoolState, RootState>
) => {
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

  return {
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
}
