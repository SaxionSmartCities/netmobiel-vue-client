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
    },
  },
  actions,
  getters,
  mutations,
}
