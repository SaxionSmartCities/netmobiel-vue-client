export default {
  fetchBankerStatementsMaxResults: 10,
  fetchTripsMaxResults: 8,
  fetchPastTripsMaxResults: 8,
  fetchPastRidesMaxResults: 8,
  defaultMaxResults: 10,
  defaultProfileImage: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  defaultCharityImage: '@/assets/default_charity_image.jpg',
  defaultShoutOutRadius: 1000000,
  defaultNotificationTimeout: 3000,
  searchSuggestionCategoryIcons: {
    airport: 'local_airport',
    'city-town-village': 'location_city',
    hotel: 'local_hotel',
    'railway-station': 'train',
    restaurant: 'restaurant',
    'sights-museums': 'museum',
    'sports-facility-venue': 'sports',
    'taxi-stand': 'local_taxi',
    'theatre-music-culture': 'theaters',
  },
  searchSuggestionDefaultIcon: 'fa-map-marker-alt',
  maxComplimentsAllowed: 3,
  COMPLETE_PROFILE_UPDATE: {
    title: 'Verdien een gratis rit!',
    content:
      'Maak jouw profiel compleet en verdien een gratis rit met Netmobiel!',
    link: {
      label: 'Profiel compleet maken',
      to: '/onboardingPage',
    },
  },
  PROFILE_ROLE_DRIVER: 'driver',
  PROFILE_ROLE_PASSENGER: 'passenger',
  PROFILE_ROLE_BOTH: 'both',
  TRIP_NOT_MADE_REASONS: [
    {
      title: 'De rit was niet meer nodig',
      value: 'unnecessary',
    },
    {
      title: 'Ander vervoer gevonden',
      value: 'otherTransport',
    },
    {
      title: 'De chauffeur kwam niet opdagen.',
      value: '',
    },
  ],
}
