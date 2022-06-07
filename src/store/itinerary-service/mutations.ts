import { ModuleBuilder } from 'vuex-typex'
import { RootState } from '@/store/Rootstate'
import {
  ItineraryState,
  SearchCriteria,
  SubmitStatus,
  Trip,
  TripPlan,
  UserReport,
} from '@/store/itinerary-service/types'
import { Page } from '@/store/types'
import { assignPageResults } from '@/store/storeHelper'

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

function setPlanningSearchCriteria(
  state: ItineraryState,
  payload: SearchCriteria
) {
  state.planningRequest.from = payload.from
  state.planningRequest.to = payload.to
  state.planningRequest.travelTime = payload.travelTime
  state.planningRequest.preferences = payload.preferences
}

function setPlanningStatus(state: ItineraryState, payload: SubmitStatus) {
  state.planningRequest.submitStatus = payload
}

function clearPlanningResults(state: ItineraryState, payload: any) {
  state.planningRequest.tripPlan = null
}

function setPlanningResults(state: ItineraryState, payload: TripPlan) {
  state.planningRequest.tripPlan = payload
}

function clearPlanningRequest(state: ItineraryState) {
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

function setSelectedTripPlan(state: ItineraryState, payload: TripPlan | null) {
  state.selectedTripPlan = payload
}

function setSelectedShoutOut(state: ItineraryState, payload: TripPlan | null) {
  state.selectedShoutOut = payload
}

function setShoutOuts(state: ItineraryState, shoutOuts: Page<TripPlan>) {
  state.shoutOuts = assignPageResults(state.shoutOuts, shoutOuts)
}

function setPastShoutOuts(state: ItineraryState, shoutOuts: Page<TripPlan>) {
  state.pastShoutOuts = assignPageResults(state.pastShoutOuts, shoutOuts)
}

function setMyShoutOuts(state: ItineraryState, shoutOuts: Page<TripPlan>) {
  state.myShoutOuts = assignPageResults(state.myShoutOuts, shoutOuts)
}

function setMyPastShoutOuts(state: ItineraryState, shoutOuts: Page<TripPlan>) {
  state.myPastShoutOuts = assignPageResults(state.myPastShoutOuts, shoutOuts)
}

function setSelectedTrip(state: ItineraryState, payload: Trip | null) {
  state.selectedTrip = payload
}

function setPlannedTrips(state: ItineraryState, trips: Page<Trip>) {
  state.plannedTrips = assignPageResults(state.plannedTrips, trips)
}

function setPastTrips(state: ItineraryState, trips: Page<Trip>) {
  state.pastTrips = assignPageResults(state.pastTrips, trips)
}

function setCancelledTrips(state: ItineraryState, trips: Page<Trip>) {
  state.cancelledTrips = assignPageResults(state.cancelledTrips, trips)
}

function setSelectedUserReport(
  state: ItineraryState,
  userReport: UserReport | null
) {
  state.userReport = userReport
}

export const buildMutations = (
  isBuilder: ModuleBuilder<ItineraryState, RootState>
) => {
  return {
    // Trip plans & searching
    setSearchCriteria: isBuilder.commit(setSearchCriteria),
    setPlanningSearchCriteria: isBuilder.commit(setPlanningSearchCriteria),
    setPlanningStatus: isBuilder.commit(setPlanningStatus),
    setPlanningResults: isBuilder.commit(setPlanningResults),
    clearPlanningResults: isBuilder.commit(clearPlanningResults),
    clearPlanningRequest: isBuilder.commit(clearPlanningRequest),
    clearBookingRequest: isBuilder.commit(clearBookingRequest),
    setBookingStatus: isBuilder.commit(setBookingStatus),
    setSelectedTripPlan: isBuilder.commit(setSelectedTripPlan),

    // Trips
    setSelectedTrip: isBuilder.commit(setSelectedTrip),
    setPlannedTrips: isBuilder.commit(setPlannedTrips),
    setPastTrips: isBuilder.commit(setPastTrips),
    setCancelledTrips: isBuilder.commit(setCancelledTrips),

    // Shout-outs
    setSelectedShoutOut: isBuilder.commit(setSelectedShoutOut),
    setShoutOuts: isBuilder.commit(setShoutOuts),
    setPastShoutOuts: isBuilder.commit(setPastShoutOuts),
    setMyShoutOuts: isBuilder.commit(setMyShoutOuts),
    setMyPastShoutOuts: isBuilder.commit(setMyPastShoutOuts),

    // Reports
    setSelectedUserReport: isBuilder.commit(setSelectedUserReport),
  }
}
