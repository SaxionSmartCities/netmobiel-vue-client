import { ModuleBuilder } from 'vuex-typex'
import { Car, CarpoolState, Ride, Booking } from '@/store/carpool-service/types'
import { RootState } from '@/store/Rootstate'
import { Page } from '@/store/types'
import { assignPageResults } from '@/store/storeHelper'

function setCarSearchLicensePlate(state: CarpoolState, payload: string) {
  state.carSearch.licensePlate = payload
}

function setCarSearchResult(state: CarpoolState, payload: Car) {
  state.carSearch.result = payload
}

function clearCarSearchResult(state: CarpoolState) {
  state.carSearch.result = null
}

function setAvailableCars(state: CarpoolState, payload: Car[]) {
  state.cars = payload
}

function setSelectedCar(state: CarpoolState, payload: Car | null) {
  state.selectedCar = payload
}

function setSelectedRide(state: CarpoolState, payload: Ride | null) {
  state.selectedRide = payload
}

function setPlannedRides(state: CarpoolState, rides: Page<Ride>) {
  state.plannedRides = assignPageResults(state.plannedRides, rides)
}

function setPastRides(state: CarpoolState, rides: Page<Ride>) {
  state.pastRides = assignPageResults(state.pastRides, rides)
}

function setValidatingRides(state: CarpoolState, rides: Page<Ride>) {
  state.validatingRides = assignPageResults(state.validatingRides, rides)
}

function setSelectedBooking(state: CarpoolState, payload: Booking | null) {
  state.selectedBooking = payload
}

export const buildMutations = (
  csBuilder: ModuleBuilder<CarpoolState, RootState>
) => {
  return {
    setCarSearchLicensePlate: csBuilder.commit(setCarSearchLicensePlate),
    setCarSearchResult: csBuilder.commit(setCarSearchResult),
    clearCarSearchResult: csBuilder.commit(clearCarSearchResult),
    setAvailableCars: csBuilder.commit(setAvailableCars),
    setSelectedCar: csBuilder.commit(setSelectedCar),

    setPlannedRides: csBuilder.commit(setPlannedRides),
    setPastRides: csBuilder.commit(setPastRides),
    setValidatingRides: csBuilder.commit(setValidatingRides),
    setSelectedRide: csBuilder.commit(setSelectedRide),
    setSelectedBooking: csBuilder.commit(setSelectedBooking),
  }
}
