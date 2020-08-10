import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { CarpoolState } from '@/store/carpool-service/types'

// @ts-ignore
const csBuilder: ModuleBuilder = getStoreBuilder().module('cs')

function addRideToList(state: CarpoolState, payload: any) {
  state.rides.push(payload)
}

function setSearchLicensePlate(state: CarpoolState, payload: any) {
  state.search.licensePlate = payload
}

function setSearchResult(state: CarpoolState, payload: any) {
  state.search.result = payload
}

function clearSearchResult(state: CarpoolState, payload: any) {
  state.search.result = null
}

function setAvailableCars(state: CarpoolState, payload: any) {
  state.cars = payload
}

function setPlannedRidesCount(state: CarpoolState, payload: any) {
  state.plannedRidesCount = payload
}

function saveRides(state: CarpoolState, payload: any) {
  state.rides = payload
}

function appendRides(state: CarpoolState, payload: any) {
  state.rides = state.rides.concat(payload)
}

function deleteRides(state: CarpoolState, payload: any) {
  for (var i = state.rides.length - 1; i >= 0; --i) {
    // @ts-ignore
    if (state.rides[i].id == payload) {
      state.rides.splice(i, 1)
      break
    }
  }
}

function setSelectedRide(state: CarpoolState, payload: any) {
  state.selectedRide = payload
}

export default {
  addRideToList: csBuilder.commit(addRideToList),
  setSearchLicensePlate: csBuilder.commit(setSearchLicensePlate),
  setSearchResult: csBuilder.commit(setSearchResult),
  clearSearchResult: csBuilder.commit(clearSearchResult),
  setAvailableCars: csBuilder.commit(setAvailableCars),
  setPlannedRidesCount: csBuilder.commit(setPlannedRidesCount),
  saveRides: csBuilder.commit(saveRides),
  appendRides: csBuilder.commit(appendRides),
  deleteRides: csBuilder.commit(deleteRides),
  setSelectedRide: csBuilder.commit(setSelectedRide),
}
