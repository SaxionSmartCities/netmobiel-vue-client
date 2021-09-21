import { ModuleBuilder } from 'vuex-typex'
import {
  Car,
  CarpoolState,
  Ride,
  CarSearchResult,
  RideshareUser,
} from '@/store/carpool-service/types'
import { RootState } from '@/store/Rootstate'

function addRideToList(state: CarpoolState, payload: Ride) {
  state.rides.push(payload)
}

function setCarSearchLicensePlate(state: CarpoolState, payload: string) {
  state.carSearch.licensePlate = payload
}

function setCarSearchResult(state: CarpoolState, payload: CarSearchResult) {
  state.carSearch.result = payload
}

function clearCarSearchResult(state: CarpoolState) {
  state.carSearch.result = null
}

function setAvailableCars(state: CarpoolState, payload: Car[]) {
  state.cars = payload
}

function setSelectedCar(state: CarpoolState, payload: Car) {
  state.selectedCar = payload
}
function setPlannedRidesCount(state: CarpoolState, payload: number) {
  state.plannedRidesCount = payload
}
function setPastRidesCount(state: CarpoolState, payload: number) {
  state.pastRidesCount = payload
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

function setInboxRides(state: CarpoolState, payload: Ride[]) {
  state.inboxRides = payload
}

function addUser(state: CarpoolState, user: RideshareUser) {
  if (user.managedIdentity) {
    state.users.set(user.userRef, user)
  }
}

export const buildMutations = (
  csBuilder: ModuleBuilder<CarpoolState, RootState>
) => {
  return {
    addRideToList: csBuilder.commit(addRideToList),
    setCarSearchLicensePlate: csBuilder.commit(setCarSearchLicensePlate),
    setCarSearchResult: csBuilder.commit(setCarSearchResult),
    clearCarSearchResult: csBuilder.commit(clearCarSearchResult),
    setAvailableCars: csBuilder.commit(setAvailableCars),
    setSelectedCar: csBuilder.commit(setSelectedCar),
    setPlannedRidesCount: csBuilder.commit(setPlannedRidesCount),
    setPastRidesCount: csBuilder.commit(setPastRidesCount),
    saveRides: csBuilder.commit(saveRides),
    savePastRides: csBuilder.commit(savePastRides),
    appendPastRides: csBuilder.commit(appendPastRides),
    appendRides: csBuilder.commit(appendRides),
    deleteRides: csBuilder.commit(deleteRides),
    setSelectedRide: csBuilder.commit(setSelectedRide),
    setProposedRides: csBuilder.commit(setProposedRides),
    setInboxRides: csBuilder.commit(setInboxRides),
    addUser: csBuilder.commit(addUser),
  }
}
