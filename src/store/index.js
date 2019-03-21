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
      //these fields are only used for the registration
      name: undefined,
      email: undefined,
      password: undefined,
      //
      dateOfBirth: Date.now(),
      biography: '',
      maxWalkDistance: 10,
      flexibility: 10,
      rideBaggage: {
        baggage: false,
        wheelChair: false,
        animal: false,
      },
      conveyancePreferences: {
        rideAlong: false,
        regionTaxi: false,
        bus: false,
        shareCar: false,
        shareBike: false,
        train: false,
      },
    },
    ui: {
      registrationStep: 1,
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
