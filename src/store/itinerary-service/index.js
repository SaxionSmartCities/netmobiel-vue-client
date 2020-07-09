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
    searchCriteria: {
      from: null,
      to: null,
      travelTime: null,
      preferences: null,
    },
    planningRequest: {
      from: null,
      to: null,
      travelTime: null,
      preferences: null,
      submitStatus: {
        status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
        message: '',
      },
      result: null,
    },
  },
  getters,
  mutations,
  actions,
}
