import { ModuleBuilder } from 'vuex-typex'
import { ItineraryState } from '@/store/itinerary-service/types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  isBuilder: ModuleBuilder<ItineraryState, RootState>
) => {
  const getPlanningRequest = isBuilder.read((state: ItineraryState) => {
    return state.planningRequest
  }, 'getPlanningRequest')

  const getPlanningStatus = isBuilder.read((state: ItineraryState) => {
    return state.planningRequest.submitStatus
  }, 'getPlanningStatus')

  const getPlanningResults = isBuilder.read((state: ItineraryState) => {
    return state.planningRequest.tripPlan
  }, 'getPlanningResults')

  const getSelectedTripPlan = isBuilder.read((state: ItineraryState) => {
    return state.selectedTripPlan
  }, 'getSelectedTripPlan')

  const getSelectedShoutOut = isBuilder.read((state: ItineraryState) => {
    return state.selectedShoutOut
  }, 'getSelectedShoutOut')

  const getSelectedTrip = isBuilder.read((state: ItineraryState) => {
    return state.selectedTrip
  }, 'getSelectedTrip')

  const getPlannedTrips = isBuilder.read((state: ItineraryState) => {
    return state.plannedTrips
  }, 'getPlannedTrips')

  const getPlannedTripsCount = isBuilder.read((state: ItineraryState) => {
    return state.plannedTripsCount
  }, 'getPlannedTripsCount')

  const getPastTrips = isBuilder.read((state: ItineraryState) => {
    return state.pastTrips
  }, 'getPastTrips')

  const getPastTripsCount = isBuilder.read((state: ItineraryState) => {
    return state.pastTripsCount
  }, 'getPastTripsCount')

  const getShoutOuts = isBuilder.read((state: ItineraryState) => {
    return state.shoutOuts
  }, 'getShoutOuts')

  const getShoutOutsTotalCount = isBuilder.read((state: ItineraryState) => {
    return state.shoutOutsTotalCount
  }, 'getShoutOutsTotalCount')

  const getMyShoutOuts = isBuilder.read((state: ItineraryState) => {
    return state.myShoutOuts
  }, 'getMyShoutOuts')

  const getMyShoutOutsCount = isBuilder.read((state: ItineraryState) => {
    return state.myShoutOutsCount
  }, 'getMyShoutOutsCount')

  const getSearchCriteria = isBuilder.read((state: ItineraryState) => {
    return state.searchCriteria
  }, 'getSearchCriteria')

  const getCancelledTrips = isBuilder.read((state: ItineraryState) => {
    return state.cancelledTrips
  }, 'getCancelledTrips')

  const getBookingStatus = isBuilder.read((state: ItineraryState) => {
    return state.bookingRequest.submitStatus
  }, 'getBookingStatus')

  const getShoutoutPlanTime = isBuilder.read((state: ItineraryState) => {
    return state.shoutoutPlanTime
  }, 'getShoutoutPlanTime')

  return {
    get getPlanningRequest() {
      return getPlanningRequest()
    },
    get getPlanningStatus() {
      return getPlanningStatus()
    },
    get getPlanningResults() {
      return getPlanningResults()
    },
    get getSelectedTripPlan() {
      return getSelectedTripPlan()
    },
    get getSelectedShoutOut() {
      return getSelectedShoutOut()
    },
    get getSelectedTrip() {
      return getSelectedTrip()
    },
    get getPlannedTrips() {
      return getPlannedTrips()
    },
    get getPlannedTripsCount() {
      return getPlannedTripsCount()
    },
    get getPastTrips() {
      return getPastTrips()
    },
    get getPastTripsCount() {
      return getPastTripsCount()
    },
    get getShoutOuts() {
      return getShoutOuts()
    },
    get getShoutOutsTotalCount() {
      return getShoutOutsTotalCount()
    },
    get getMyShoutOuts() {
      return getMyShoutOuts()
    },
    get getMyShoutOutsCount() {
      return getMyShoutOutsCount()
    },
    get getSearchCriteria() {
      return getSearchCriteria()
    },
    get getCancelledTrips() {
      return getCancelledTrips()
    },
    get getBookingStatus() {
      return getBookingStatus()
    },
    get getShoutoutPlanTime() {
      return getShoutoutPlanTime()
    },
  }
}
