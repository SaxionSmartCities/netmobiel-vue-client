import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { ItineraryState } from '@/store/itinerary-service/types'
// @ts-ignore
const isBuilder: ModuleBuilder = getStoreBuilder().module('is')

function setSearchCriteria(state: ItineraryState, payload: any) {
  state.searchCriteria.from = payload.from
  state.searchCriteria.to = payload.to
  state.searchCriteria.travelTime = payload.travelTime
  state.searchCriteria.preferences = payload.preferences
}

function setSearchCriteriaField(state: ItineraryState, payload: any) {
  // @ts-ignore
  state.searchCriteria[payload.field] = payload.value
}

function storePlanningRequest(state: ItineraryState, payload: any) {
  state.planningRequest.from = payload.from
  state.planningRequest.to = payload.to
  state.planningRequest.travelTime = payload.travelTime
  state.planningRequest.preferences = payload.preferences
}

function setPlanningStatus(state: ItineraryState, payload: any) {
  state.planningRequest.submitStatus = payload
}

function setPlanningResults(state: ItineraryState, payload: any) {
  state.planningRequest.result = payload.data
}

function clearPlanningResults(state: ItineraryState, payload: any) {
  state.planningRequest.result = null
}

function clearPlanningRequest(state: ItineraryState, payload: any) {
  state.planningRequest.travelTime = null
  state.planningRequest.submitStatus = {
    status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
    message: '',
  }
}

function sortItineraries(state: ItineraryState, payload: any) {
  // @ts-ignore
  state.planningRequest.result!.data.itineraries.sort(payload)
}

function setSelectedTrip(state: ItineraryState, payload: any) {
  state.selectedTrip = payload
}

function setPlannedTripsCount(state: ItineraryState, payload: any) {
  state.plannedTripsCount = payload
}

function setPlannedTrips(state: ItineraryState, payload: any) {
  state.plannedTrips = payload
}

function appendPlannedTrips(state: ItineraryState, payload: any) {
  state.plannedTrips = state.plannedTrips.concat(payload)
}

function setShoutOuts(state: ItineraryState, payload: any) {
  state.shoutOuts = payload
}

function setMyShoutOuts(state: ItineraryState, payload: any) {
  state.myShoutOuts = payload
}

function appendMyShoutOuts(state: ItineraryState, payload: any) {
  state.myShoutOuts.concat(payload)
}

function setShoutOutsTotalCount(state: ItineraryState, payload: any) {
  state.shoutOutsTotalCount = payload
}

function setPastTrips(state: ItineraryState, payload: any) {
  state.pastTrips = payload
}

function appendPastTrips(state: ItineraryState, payload: any) {
  state.pastTrips = state.pastTrips.concat(payload)
}

function setPastTripsCount(state: ItineraryState, payload: any) {
  state.pastTripsCount = payload
}

export default {
  setSearchCriteria: isBuilder.commit(setSearchCriteria),
  setSearchCriteriaField: isBuilder.commit(setSearchCriteriaField),
  storePlanningRequest: isBuilder.commit(storePlanningRequest),
  setPlanningStatus: isBuilder.commit(setPlanningStatus),
  setPlanningResults: isBuilder.commit(setPlanningResults),
  clearPlanningResults: isBuilder.commit(clearPlanningResults),
  clearPlanningRequest: isBuilder.commit(clearPlanningRequest),
  sortItineraries: isBuilder.commit(sortItineraries),
  setSelectedTrip: isBuilder.commit(setSelectedTrip),
  setPlannedTripsCount: isBuilder.commit(setPlannedTripsCount),
  setPlannedTrips: isBuilder.commit(setPlannedTrips),
  appendPlannedTrips: isBuilder.commit(appendPlannedTrips),
  setShoutOuts: isBuilder.commit(setShoutOuts),
  setMyShoutOuts: isBuilder.commit(setMyShoutOuts),
  appendMyShoutOuts: isBuilder.commit(appendMyShoutOuts),
  setShoutOutsTotalCount: isBuilder.commit(setShoutOutsTotalCount),
  setPastTrips: isBuilder.commit(setPastTrips),
  appendPastTrips: isBuilder.commit(appendPastTrips),
  setPastTripsCount: isBuilder.commit(setPastTripsCount),
}
