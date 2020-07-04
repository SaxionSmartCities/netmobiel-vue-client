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
    myShoutOuts: [],
    shoutOutsTotalCount: 0,
    plannedTripsCount: 0,
    plannedTrips: [],
    pastTripsCount: 0,
    pastTrips: [],
    planningRequest: {
      from: null,
      to: null,
      timestamp: null,
      preferences: null,
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
