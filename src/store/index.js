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
    selectedItinerary: {},
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
      profile: [{ name: 'Ik bied ritten aan', value: false }],
      notificationOptions: [
        { name: 'Bevestiging nieuwe reis', value: true },
        { name: 'Wijziging bewaarde reis', value: true },
        { name: 'Herinnering voor aanvang reis', value: false },
        { name: 'Nieuw persoonlijke bericht', value: true },
        { name: 'Oproepen uit de community', value: false },
      ],
      reviews: [
        { name: 'Beoordeel je reis', value: true },
        { name: 'Deel mijn reviews met anderen', value: false },
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
      backButtonVisible: false,
    },
    geocoder: {
      query: '',
      suggestions: [],
    },
  },
  getters,
  mutations,
  actions,
})
