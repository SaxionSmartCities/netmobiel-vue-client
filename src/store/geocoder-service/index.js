import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    geocoder: {
      query: '',
      suggestions: [],
      pickedLocations: {
        to: { address: undefined, displayPosition: undefined },
        from: { address: undefined, displayPosition: undefined },
      },
    },
  },
  getters,
  mutations,
  actions,
}
