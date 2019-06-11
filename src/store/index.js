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
    planningRequest: {
      fromPlace: {
        lat: 0.0,
        lon: 0.0,
      },
      toPlace: {
        lat: 0.0,
        lon: 0.0,
      },
      submitStatus: {
        status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
        message: '',
      },
      result: {
        data: '',
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
    searchedLocation: { name: '', type: '' },
    locations: [
      { name: 'Vorden', type: 'train' },
      { name: 'Vorden Station', type: 'train' },
      { name: 'Vorden Centrum', type: 'train' },
      { name: 'Vordensebeek, Zwolle', type: 'train' },
      { name: 'Vordensebeek, Warnsveld', type: 'train' },
      { name: 'Vorden, Kasteel Hackfort', type: 'home' },
    ],
  },
  getters,
  mutations,
  actions,
})
