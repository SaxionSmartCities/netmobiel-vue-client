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

  const getCarSearchResult = csBuilder.read((state: CarpoolState) => {
    return state.carSearch.result
  }, 'getCarSearchResult')

  const getCarSearchLicensePlate = csBuilder.read((state: CarpoolState) => {
    return state.carSearch.licensePlate
  }, 'getCarSearchLicensePlate')

  const getPastRides = csBuilder.read((state: CarpoolState) => {
    return state.pastRides
  }, 'getPastRides')

  const getPastRidesCount = csBuilder.read((state: CarpoolState) => {
    return state.pastRidesCount
  }, 'getPastRidesCount')

  const getProposedRides = csBuilder.read((state: CarpoolState) => {
    return state.proposedRides
  }, 'getProposedRides')

  const getInboxRides = csBuilder.read((state: CarpoolState) => {
    return state.inboxRides
  }, 'getInboxRides')

  const getUsers = csBuilder.read((state: CarpoolState) => {
    return state.users
  }, 'getUsers')

  return {
    get getCarSearchResult() {
      return getCarSearchResult()
    },
    get getCarSearchLicensePlate() {
      return getCarSearchLicensePlate()
    },
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
    get getPastRides() {
      return getPastRides()
    },
    get getPastRidesCount() {
      return getPastRidesCount()
    },
    get getProposedRides() {
      return getProposedRides()
    },
    get getInboxRides() {
      return getInboxRides()
    },
    get getUsers() {
      return getUsers()
    },
  }
}
