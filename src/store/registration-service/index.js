import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    registrationRequest: {
      firstName: '',
      lastName: '',
      email: '',
      submitStatus: {
        success: undefined,
        message: '',
      },
    },
  },
  actions,
  getters,
  mutations,
}
