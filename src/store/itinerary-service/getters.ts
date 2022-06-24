import { ModuleBuilder } from 'vuex-typex'
import { ItineraryState } from '@/store/itinerary-service/types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  isBuilder: ModuleBuilder<ItineraryState, RootState>
) => {
  const getSearchCriteria = isBuilder.read((state: ItineraryState) => {
    return state.searchCriteria
  }, 'getSearchCriteria')

  const getBookingStatus = isBuilder.read((state: ItineraryState) => {
    return state.bookingRequest.submitStatus
  }, 'getBookingStatus')

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

  const getSelectedTrip = isBuilder.read((state: ItineraryState) => {
    return state.selectedTrip
  }, 'getSelectedTrip')

  const getPlannedTrips = isBuilder.read((state: ItineraryState) => {
    return state.plannedTrips
  }, 'getPlannedTrips')

  const getPastTrips = isBuilder.read((state: ItineraryState) => {
    return state.pastTrips
  }, 'getPastTrips')

  const getValidatingTrips = isBuilder.read((state: ItineraryState) => {
    return state.validatingTrips
  }, 'getValidatingTrips')

  const getSelectedShoutOut = isBuilder.read((state: ItineraryState) => {
    return state.selectedShoutOut
  }, 'getSelectedShoutOut')

  const getShoutOuts = isBuilder.read((state: ItineraryState) => {
    return state.shoutOuts
  }, 'getShoutOuts')

  const getPastShoutOuts = isBuilder.read((state: ItineraryState) => {
    return state.pastShoutOuts
  }, 'getPastShoutOuts')

  const getMyShoutOuts = isBuilder.read((state: ItineraryState) => {
    return state.myShoutOuts
  }, 'getMyShoutOuts')

  const getMyPastShoutOuts = isBuilder.read((state: ItineraryState) => {
    return state.myPastShoutOuts
  }, 'getMyPastShoutOuts')

  const getSelectedUserReport = isBuilder.read((state: ItineraryState) => {
    return state.userReport
  }, 'getSelectedUserReport')

  return {
    // Trip plans & searching
    get getSearchCriteria() {
      return getSearchCriteria()
    },
    get getBookingStatus() {
      return getBookingStatus()
    },
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

    // Trips
    get getSelectedTrip() {
      return getSelectedTrip()
    },
    get getPlannedTrips() {
      return getPlannedTrips()
    },
    get getPastTrips() {
      return getPastTrips()
    },
    get getValidatingTrips() {
      return getValidatingTrips()
    },

    // Shout-outs
    get getSelectedShoutOut() {
      return getSelectedShoutOut()
    },
    get getShoutOuts() {
      return getShoutOuts()
    },
    get getPastShoutOuts() {
      return getPastShoutOuts()
    },
    get getMyShoutOuts() {
      return getMyShoutOuts()
    },
    get getMyPastShoutOuts() {
      return getMyPastShoutOuts()
    },

    // Reports
    get getSelectedUserReport() {
      return getSelectedUserReport()
    },
  }
}
