import { ModuleBuilder } from 'vuex-typex'
import {
  Car,
  CarpoolState,
  Ride,
  SearchResult,
} from '@/store/carpool-service/types'
import { RootState } from '@/store/Rootstate'

function addRideToList(state: CarpoolState, payload: Ride) {
  state.rides.push(payload)
}

function setSearchLicensePlate(state: CarpoolState, payload: string) {
  state.search.licensePlate = payload
}

function setSearchResult(state: CarpoolState, payload: SearchResult) {
  state.search.result = payload
}

function clearSearchResult(state: CarpoolState) {
  state.search.result = null
}

function setAvailableCars(state: CarpoolState, payload: Car[]) {
  state.cars = payload
}

function setPlannedRidesCount(state: CarpoolState, payload: number) {
  state.plannedRidesCount = payload
}

function saveRides(state: CarpoolState, payload: Ride[]) {
  state.rides = payload
}

function appendRides(state: CarpoolState, payload: Ride[]) {
  state.rides = state.rides.concat(payload)
}

function deleteRides(state: CarpoolState, payload: string) {
  for (let i = state.rides.length - 1; i >= 0; --i) {
    // @ts-ignore
    if (state.rides[i].id == payload) {
      state.rides.splice(i, 1)
      break
    }
  }
}

function setSelectedRide(state: CarpoolState, payload: Ride) {
  state.selectedRide = payload
}

function savePastRides(state: CarpoolState, payload: Ride[]) {
  state.pastRides = payload
}

function appendPastRides(state: CarpoolState, payload: Ride[]) {
  state.pastRides = state.pastRides.concat(payload)
}

function setProposedRides(state: CarpoolState, payload: Ride[]) {
  state.proposedRides = payload
}

export const buildMutations = (
  csBuilder: ModuleBuilder<CarpoolState, RootState>
) => {
  return {
    addRideToList: csBuilder.commit(addRideToList),
    setSearchLicensePlate: csBuilder.commit(setSearchLicensePlate),
    setSearchResult: csBuilder.commit(setSearchResult),
    clearSearchResult: csBuilder.commit(clearSearchResult),
    setAvailableCars: csBuilder.commit(setAvailableCars),
    setPlannedRidesCount: csBuilder.commit(setPlannedRidesCount),
    saveRides: csBuilder.commit(saveRides),
    savePastRides: csBuilder.commit(savePastRides),
    appendPastRides: csBuilder.commit(appendPastRides),
    appendRides: csBuilder.commit(appendRides),
    deleteRides: csBuilder.commit(deleteRides),
    setSelectedRide: csBuilder.commit(setSelectedRide),
    setProposedRides: csBuilder.commit(setProposedRides),
  }
}
