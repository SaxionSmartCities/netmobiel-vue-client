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
          id: 0,
          name: 'Thuis',
          address: 'Dorpstraat 19, Zieuwent',
          lat: 52.001796,
          long: 6.520976,
        },
        {
          id: 1,
          name: 'Elders',
          address: 'Dorpstraat 21, Zieuwent',
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
      selectedLocationId: -1,
    },
  },
  getters,
  mutations,
  actions,
})
