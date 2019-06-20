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
      image: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      rating: 2,
      maxRating: 3,

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
      privacySecurity: [
        { name: 'Gebruik mijn locatie tijdens het reizen', value: false },
        { name: 'Deel reisdata met NetMobiel', value: false },
        { name: 'Verberg mijn gegevens voor anderen', value: false },
      ],
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
    geocoder: {
      query: '',
      suggestions: [],
    },
  },
  getters,
  mutations,
  actions,
})
