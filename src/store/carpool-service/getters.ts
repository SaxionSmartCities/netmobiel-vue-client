import { ModuleBuilder } from 'vuex-typex'
import { CarpoolState } from '@/store/carpool-service/types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  csBuilder: ModuleBuilder<CarpoolState, RootState>
) => {
  const getAvailableCars = csBuilder.read((state: CarpoolState) => {
    return state.cars
  }, 'getAvailableCars')

  const getSelectedCar = csBuilder.read((state: CarpoolState) => {
    return state.selectedCar
  }, 'getSelectedCar')

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

  const getPastRides = csBuilder.read((state: CarpoolState) => {
    return state.pastRides
  }, 'getPastRides')

  const getProposedRides = csBuilder.read((state: CarpoolState) => {
    return state.proposedRides
  }, 'getProposedRides')

  const getInboxRides = csBuilder.read((state: CarpoolState) => {
    return state.inboxRides
  }, 'getInboxRides')

  return {
    get getAvailableCars() {
      return getAvailableCars()
    },
    get getSelectedCar() {
      return getSelectedCar()
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
    get getPastRides() {
      return getPastRides()
    },
    get getProposedRides() {
      return getProposedRides()
    },
    get getInboxRides() {
      return getInboxRides()
    },
  }
}
