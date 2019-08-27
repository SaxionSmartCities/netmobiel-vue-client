import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  state: {
    registrationRequest: {
      first_name: '',
      last_name: '',
      email: '',
      submitStatus: {
        success: undefined,
        message: '',
      },
    },
  },
  getters,
  mutations,
  actions,
}
