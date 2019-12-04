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
      address: {
        locality: '',
      },
      userRole: '',
      consent: {
        olderThanSixteen: false,
        acceptedTerms: false,
      },
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
