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

  const getCarSearchResult = csBuilder.read((state: CarpoolState) => {
    return state.carSearch.result
  }, 'getCarSearchResult')

  const getCarSearchLicensePlate = csBuilder.read((state: CarpoolState) => {
    return state.carSearch.licensePlate
  }, 'getCarSearchLicensePlate')

  const getSelectedRide = csBuilder.read((state: CarpoolState) => {
    return state.selectedRide
  }, 'getSelectedRide')

  const getPlannedRides = csBuilder.read((state: CarpoolState) => {
    return state.plannedRides
  }, 'getPlannedRides')

  const getPastRides = csBuilder.read((state: CarpoolState) => {
    return state.pastRides
  }, 'getPastRides')

  const getProposedRides = csBuilder.read((state: CarpoolState) => {
    return state.proposedRides
  }, 'getProposedRides')

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

    get getSelectedRide() {
      return getSelectedRide()
    },
    get getPlannedRides() {
      return getPlannedRides()
    },
    get getPastRides() {
      return getPastRides()
    },
    get getProposedRides() {
      return getProposedRides()
    },
  }
}
