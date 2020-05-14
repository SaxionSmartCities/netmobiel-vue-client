import getters from './getters'
import mutations from './mutations'
import actions from './actions'

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
        image:
          'data:image/jpeg;base64,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',
        searchPreferences: {
          numPassengers: 0,
          allowTransfer: true,
          maximumTransferTime: 0,
          luggageOptions: [],
          allowedTravelModes: [],
        },
        ridePlanOptions: {
          numPassengers: 0,
          maxMinutesDetour: 10,
          luggageOptions: ['HANDLUGGAGE', 'GROCERIES'],
          selectedCarId: -1,
          cars: [],
        },
        favoriteLocations: [],
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
      credits: {
        creditAmount: 0,
        creditHistory: [],
      },
    },
  },
  actions,
  getters,
  mutations,
}
