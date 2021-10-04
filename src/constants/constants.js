export default {
  fetchBankerStatementsMaxResults: 10,
  fetchTripsMaxResults: 8,
  fetchPastTripsMaxResults: 8,
  fetchPastRidesMaxResults: 8,
  defaultMaxResults: 10,
  defaultProfileImage: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  defaultCharityImage: '@/assets/default_charity_image.jpg',
  shoutOutDepArrRadiusWhole_NL: 200000,
  shoutOutDepArrRadiusNearby: 20000,
  shoutOutTravelRadius: 50000,
  defaultNotificationTimeout: 3000,
  searchSuggestionCategoryIcons: {
    airport: 'local_airport',
    'bus-station': 'directions_bus',
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
  DEFAULT_PROFILE_SEARCH_PREFERENCES: {
    numPassengers: 1,
    maxTransfers: undefined,
    maxWalkDistance: 500,
    luggageOptions: ['HANDLUGGAGE', 'GROCERIES'],
    allowedTravelModes: ['BUS', 'RAIL', 'RIDESHARE', 'WALK'],
    allowFirstLegRideshare: true,
    allowLastLegRideshare: true,
    needsAssistance: false,
  },
  DEFAULT_PROFILE_RIDE_PREFERENCES: {
    ableToAssist: true,
    maxPassengers: 3,
    maxTimeDetour: 20,
    maxDistanceDetour: 20000,
    luggageOptions: ['HANDLUGGAGE', 'GROCERIES', 'STROLLER'],
    selectedCarRef: undefined,
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
  // Geographic center of the Netherlands (near Lunteren)
  GEOLOCATION_CENTER_NL: {
    label: 'Midden van Nederland',
    latitude: 52.063045,
    longitude: 5.349972,
  },
  // Default radius in meter
  DEFAULT_GEOCODER_RADIUS: 150000,
}
