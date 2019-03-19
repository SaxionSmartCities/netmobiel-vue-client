import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    user: {
      locations: [
        {
          name: 'Thuis',
          adress: 'Dorpstraat 19, Zieuwent',
          lat: 52.001796,
          long: 6.520976,
        },
      ],
    },
    ui: {
      header: {
        visible: true,
      },
      footer: {
        visible: true,
      },
    },
  },
  getters,
  mutations,
  actions,
})
