export default {
  // NOTE: For the messages the value must be large enough to fill the screen in one fetch
  fetchMessagesMaxResults: 30,
  fetchConversationsMaxResults: 20,
  fetchMyShoutOutsMaxResults: 10,
  fetchCommunityShoutOutsMaxResults: 10,
  fetchTripsMaxResults: 20,
  fetchPastTripsMaxResults: 20,
  fetchPastRidesMaxResults: 20,
  fetchBankerStatementsMaxResults: 20,
  fetchPaymentBatchesMaxResults: 50,
  fetchWithdrawalsMaxResults: 50,
  fetchRewardsMaxResults: 50,
  fetchCharityMaxResults: 10,
  fetchCharityTopDonorsMaxResults: 5,
  fetchPreviouslyDonatedCharitiesMaxResults: 5,
  fetchCharityDetailTopDonorsMaxResults: 5,
  fetchCharityDetailDonationsMaxResults: 20,
  defaultMaxResults: 10,
  defaultProfileImage: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
  defaultCharityImage: '@/assets/default_charity_image.jpg',
  shoutOutDepArrRadiusWhole_NL: 200000,
  shoutOutDepArrRadiusNearby: 20000,
  shoutOutTravelRadius: 50000,
  defaultNotificationTimeout: 5000,
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
  COMPLIMENT_MAPPING: {
    SAME_INTERESTS: 'Zelfde interesses',
    ON_TIME: 'Op tijd',
    TALKS_EASILY: 'Soepele communicatie',
    SOCIABLE: 'Gezellig',
    NEATLY: 'Netjes',
    NICE_CAR: 'Goede auto',
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
  PASSENGER_TRIP_NOT_MADE_REASONS: [
    {
      title: 'Reis was niet meer nodig',
      value: 'TRIP_NOT_NEEDED',
    },
    {
      title: 'Ander vervoer gevonden',
      value: 'FOUND_OTHER_TRANSPORT',
    },
    {
      title: 'Chauffeur kwam niet opdagen',
      value: 'NO_SHOW',
    },
  ],
  DRIVER_TRIP_NOT_MADE_REASONS: [
    {
      title: 'Passagier had rit niet meer nodig',
      value: 'TRIP_NOT_NEEDED',
    },
    {
      title: 'Passagier had ander vervoer gevonden',
      value: 'FOUND_OTHER_TRANSPORT',
    },
    {
      title: 'Passagier kwam niet opdagen',
      value: 'NO_SHOW',
    },
    {
      title: 'Ik heb helemaal niet gereden',
      value: 'NO_TRIP',
    },
  ],
  // Geographic center of the Netherlands (near Bunschoten-Spakenburg)
  GEOLOCATION_CENTER_NL: {
    label: 'Midden van Nederland',
    latitude: 52.25,
    longitude: 5.35,
  },
  // Default radius in meter to fit the Netherlands
  DEFAULT_GEOCODER_RADIUS: 175000,
  // The identity of the system as a fake managed identity
  SYSTEM_IDENTITY: 'SYSTEM',
  SYSTEM_NAME: 'Netmobiel',
  SYSTEM_AVATAR: 'SYSTEM_AVATAR',
  CONVERSATION_OWNER_ROLE: {
    PASSENGER: 'PASSENGER',
    DRIVER: 'DRIVER',
    DELEGATE: 'DELEGATE',
    DELEGATOR: 'DELEGATOR',
  },
  PAYMENT_STATE: {
    RESERVED: 'Gereserveerd',
    CANCELLED: 'Geannuleerd',
    PAID: 'Betaald',
  },
  TRISTATE: {
    TRUE: 'Ja',
    FALSE: 'Nee',
    UNDECIDED: 'Onbeslist',
  },
  PAYMENT_STATUS: [
    {
      final: false,
      status: 'REQUESTED',
      iconName: 'watch_later',
      label: 'In aanvraag',
      iconColor: 'info',
      iconClass: 'material-icons-outlined',
    },
    {
      final: false,
      status: 'ACTIVE',
      iconName: 'supervisor_account',
      label: 'In behandeling',
      iconColor: 'warning',
      iconClass: 'material-icons-outlined',
    },
    {
      final: true,
      status: 'COMPLETED',
      iconName: 'check',
      label: 'Afgerond',
      iconColor: 'success',
      iconClass: '',
    },
    {
      final: true,
      status: 'CANCELLED',
      iconName: 'close',
      label: 'Afgewezen',
      iconColor: 'error',
      iconClass: '',
    },
    {
      final: true,
      status: 'EXPIRED',
      iconName: 'assignment_late',
      label: 'Verlopen',
      iconColor: 'error',
      iconClass: 'material-icons-outlined',
    },
  ],
  PREMIUM_ACCOUNT_NCAN: 'premiums',
  BANKING_ACCOUNT_NCAN: 'banking-reserve',
  RESERVATIONS_ACCOUNT_NCAN: 'reservations',
  PREMIUM_DEPOSIT_MIN_AMOUNT: 1,
  PREMIUM_DEPOSIT_MAX_AMOUNT: 50000,
  PREMIUM_WITHDRAWAL_MIN_AMOUNT: 1,
  PREMIUM_WITHDRAWAL_MAX_AMOUNT: 50000,
  STORAGE_KEY_FCM_TOKEN: 'netmobiel.fcm',
  STORAGE_KEY_DELEGATOR_ID: 'netmobiel.delegatorId',
  SUSTAINABILITY_RATINGS: [
    {
      iconPath: 'duurzaam-1.png',
      rating: 1,
    },
    {
      iconPath: 'duurzaam-2.png',
      rating: 2,
    },
    {
      iconPath: 'duurzaam-3.png',
      rating: 3,
    },
    {
      iconPath: 'duurzaam-4.png',
      rating: 4,
    },
    {
      iconPath: 'duurzaam-5.png',
      rating: 5,
    },
  ],
}
