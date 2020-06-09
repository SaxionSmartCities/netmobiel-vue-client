import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    selectedRide: {
      from: undefined,
      to: undefined,
      date: undefined,
      itinerary: {},
    },
    cars: [],
    plannedRidesCount: 0,
    rides: [],
    search: {
      licensePlate: undefined,
      result: {},
    },
  },
  getters,
  mutations,
  actions,
}
