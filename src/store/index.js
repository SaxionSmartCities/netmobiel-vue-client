import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
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
    user: {
      // Access token
      accessToken: undefined,

      // Credentials provided by identity provider.
      givenName: undefined,
      familyName: undefined,
      fullName: undefined,
      email: undefined,

      // Other attributes
      dateOfBirth: Date.now(),
      biography: '',

      rideSearchPreferences: {
        passengersSelected: 1,
        switchSelected: 'Ja',
        bagagePrefs: {
          buggy: false,
          handbagage: false,
          animal: false,
          walker: false,
          wheelchair: false,
        },
        switchVehicle: false,
        sortSelected: 'Bekenden',
        avoidSelected: {
          bus: false,
          train: false,
          walk: false,
          bike: false,
        },
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
