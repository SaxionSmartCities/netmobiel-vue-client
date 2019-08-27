import getters from './getters'
import mutations from './mutations'

export default {
  state: {
    registrationStep: 1,
    header: {
      visible: true,
    },
    footer: {
      visible: true,
    },
    backButtonVisible: false,
  },
  getters,
  mutations,
}
