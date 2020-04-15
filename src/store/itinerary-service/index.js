import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    selectedTrip: {
      from: undefined,
      to: undefined,
      date: undefined,
      itinerary: {},
    },
    shoutOuts: [],
    plannedTripsCount: 0,
    plannedTrips: [],
    planningRequest: {
      fromPlace: { lat: 0.0, lon: 0.0 },
      toPlace: { lat: 0.0, lon: 0.0 },
      selectedTime: {},
      submitStatus: {
        status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
        message: '',
      },
      result: {
        plan: [],
      },
    },
  },
  getters,
  mutations,
  actions,
}
