import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import travelModes from '@/constants/travel-modes.js'

export default {
  namespaced: true,
  state: {
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

      // Profile as stored in profile service.
      profile: {
        id: undefined,
        fcmToken: undefined,
        ridePreferences: {
          numPassengers: 0,
          allowTransfer: true,
          maximumTransferTime: 0,
          luggageOptions: [],
          allowedTravelModes: [],
        },
      },

      // Other attributes
      dateOfBirth: Date.now(),
      biography: '',

      ridePreferences: {
        luggage: [],
        allowedTravelModes: travelModes,
        nrOfPersons: 1,
        transferAllowed: true,
        maxMinutesWalking: 15,
      },
      privacySecurity: [
        { name: 'Gebruik mijn locatie tijdens het reizen', value: false },
        { name: 'Deel reisdata met NetMobiel', value: false },
        { name: 'Verberg mijn gegevens voor anderen', value: false },
      ],
      tripOptions: [{ name: 'Ik bied ritten aan', value: false }],
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
  },
  actions,
  getters,
  mutations,
}
