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
    marketplace: {
      goals: [
        {
          subject: 'Renovatie De Zwaan',
          locatie: 'Museumcafé, Bredevoort',
          description:
            'Museumcafé De Zwaan in Bredevoort heeft een lange historie. Het café is geliefd bij het publiek en neemt een centrale rol in tijdens de jaarlijkse Boekenmarkt. ',
          donators: 32,
          creditsGoal: 1200,
          receivedCredits: 900,
          topDonators: [
            {
              name: 'Henk van der laan',
              donatedCredits: 50,
              comment: 'Ontzettend leuk! Veel succes allen.',
            },
            {
              name: 'Marc de Vries',
              donatedCredits: 20,
              comment: '',
            },
            {
              name: 'Netmobiel gebruiker',
              donatedCredits: 10,
              comment: '',
            },
            {
              name: 'Wout',
              donatedCredits: 4,
              comment: '',
            },
          ],
        },
      ],
    },
  },
  getters,
  mutations,
  actions,
})
