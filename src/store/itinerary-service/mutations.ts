import { ModuleBuilder } from 'vuex-typex'
import { RootState } from '@/store/Rootstate'
import {
  Itinerary,
  ItineraryState,
  PlanningRequest,
  PlanningResult,
  SubmitStatus,
  ShoutOut,
  Trip,
  SearchCriteria,
} from '@/store/itinerary-service/types'

function safeConcatTrips(current: Trip[], additions: Trip[]) {
  return current.concat(
    additions.filter(trip => !current.some(existing => existing.id === trip.id))
  )
}
function setSearchCriteria(state: ItineraryState, payload: SearchCriteria) {
  state.searchCriteria.from = payload.from
  state.searchCriteria.to = payload.to
  state.searchCriteria.travelTime = payload.travelTime
  state.searchCriteria.preferences = payload.preferences
}

function setSearchCriteriaField(state: ItineraryState, payload: any) {
  // @ts-ignore
  state.searchCriteria[payload.field] = payload.value
}

function storePlanningRequest(state: ItineraryState, payload: PlanningRequest) {
  state.planningRequest.from = payload.from
  state.planningRequest.to = payload.to
  state.planningRequest.travelTime = payload.travelTime
  state.planningRequest.preferences = payload.preferences
}

function setPlanningStatus(state: ItineraryState, payload: SubmitStatus) {
  state.planningRequest.submitStatus = payload
}

function setPlanningResults(state: ItineraryState, payload: PlanningResult) {
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

function setBookingStatus(state: ItineraryState, payload: SubmitStatus) {
  state.bookingRequest.submitStatus = payload
}

function clearBookingRequest(state: ItineraryState, payload: any) {
  state.bookingRequest.submitStatus = {
    status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
    message: '',
  }
}

function sortItineraries(state: ItineraryState, payload: Itinerary[]) {
  // @ts-ignore
  state.planningRequest.result!.data.itineraries.sort(payload)
}

function setSelectedTrip(state: ItineraryState, payload: Trip) {
  state.selectedTrip = payload
}

function setPlannedTripsCount(state: ItineraryState, payload: number) {
  state.plannedTripsCount = payload
}

function setPlannedTrips(state: ItineraryState, payload: Trip[]) {
  state.plannedTrips = payload
}

function appendPlannedTrips(state: ItineraryState, payload: Trip[]) {
  state.plannedTrips = safeConcatTrips(state.plannedTrips, payload)
}

function setShoutOuts(state: ItineraryState, payload: ShoutOut[]) {
  const length = state.shoutOuts.length
  state.shoutOuts.splice(0, length, ...payload)
}

function setMyShoutOuts(state: ItineraryState, payload: ShoutOut[]) {
  state.myShoutOuts = payload
}

function appendMyShoutOuts(state: ItineraryState, payload: ShoutOut[]) {
  state.myShoutOuts.concat(payload)
}

function setShoutOutsTotalCount(state: ItineraryState, payload: number) {
  state.shoutOutsTotalCount = payload
}

function setPastTrips(state: ItineraryState, payload: Trip[]) {
  state.pastTrips = payload
}

function appendPastTrips(state: ItineraryState, payload: Trip[]) {
  state.pastTrips = safeConcatTrips(state.pastTrips, payload)
}

function setPastTripsCount(state: ItineraryState, payload: number) {
  state.pastTripsCount = payload
}

function setCancelledTrips(state: ItineraryState, payload: Trip[]) {
  state.cancelledTrips = payload
}

export const buildMutations = (
  isBuilder: ModuleBuilder<ItineraryState, RootState>
) => {
  return {
    setSearchCriteria: isBuilder.commit(setSearchCriteria),
    setSearchCriteriaField: isBuilder.commit(setSearchCriteriaField),
    storePlanningRequest: isBuilder.commit(storePlanningRequest),
    setPlanningStatus: isBuilder.commit(setPlanningStatus),
    setPlanningResults: isBuilder.commit(setPlanningResults),
    clearPlanningResults: isBuilder.commit(clearPlanningResults),
    clearPlanningRequest: isBuilder.commit(clearPlanningRequest),
    clearBookingRequest: isBuilder.commit(clearBookingRequest),
    setBookingStatus: isBuilder.commit(setBookingStatus),
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
    setCancelledTrips: isBuilder.commit(setCancelledTrips),
  }
}
