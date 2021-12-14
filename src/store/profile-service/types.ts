export class ProfileState {
  complimentTypes: ComplimentType[] = []
  publicUsers: Map<string, ExternalUser> = new Map()
  externalUser: ExternalUser = {
    profile: {
      id: null,
      age: null,
      image: null,
      firstName: null,
      lastName: null,
      address: {},
      interests: [],
    },
    compliments: [],
    reviews: [],
  }
  user: User = {
    accessToken: null,
    // Attributes from the token
    managedIdentity: null,
    givenName: '',
    familyName: '',
    fullName: '',
    email: '',
    rating: 2,
    maxRating: 3,

    // Profile as stored in profile service.
    profile: {
      id: null,
      age: null,
      consent: {
        acceptedTerms: false,
        olderThanSixteen: false,
        safetyGuidelines: false,
      },
      dateOfBirth: null,
      fcmToken: null,
      firstName: null,
      lastName: null,
      image: null,
      email: null,
      phoneNumber: null,
      userRole: null,
      actingRole: null,
      address: null,
      searchPreferences: null,
      ridePlanOptions: null,
      notificationOptions: {
        tripConfirmations: true,
        tripUpdates: true,
        tripReminders: true,
        messages: true,
        shoutouts: true,
      },
      interests: [],
      favoriteLocations: [],
    },
    delegatorId: null,
    delegateProfile: null,
    delegations: [],
    privacySecurity: [
      { name: 'Gebruik mijn locatie tijdens het reizen', value: false },
      { name: 'Deel reisdata met NetMobiel', value: false },
      { name: 'Verberg mijn gegevens voor anderen', value: false },
    ],
    tripOptions: [{ name: 'Ik bied ritten aan', value: false }],
    notificationOptions: [
      { name: 'Bevestiging nieuwe rit', value: true },
      { name: 'Wijziging bewaarde rit', value: true },
      { name: 'Herinnering voor aanvang rit', value: false },
      { name: 'Nieuw persoonlijke bericht', value: true },
      { name: 'Oproepen uit de community', value: false },
    ],
    reviews: [
      { name: 'Beoordeel je rit', value: true },
      { name: 'Deel mijn beoordelingen met anderen', value: false },
    ],
    credits: {
      creditAmount: 0,
      creditHistory: [],
    },
  }
  search: ProfileSearch = {
    keyword: '',
    status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
    results: [],
  }
  // The FCM token received from the current device
  deviceFcmToken: string | null = null
}
export const emptyPublicUser: ExternalUser = {
  profile: {
    id: null,
    age: null,
    image: null,
    firstName: null,
    lastName: null,
    address: {},
    interests: [],
  },
  compliments: [],
  reviews: [],
}
export interface ExternalUser {
  profile: PublicProfile
  compliments: Compliment[] | []
  reviews: Review[] | []
}

export interface Compliment {
  sender: any
  receiver: any
}

export interface ComplimentType {
  compliment: string
}

export interface Review {
  sender: any
  receiver: any
}

export interface User {
  // Access token
  accessToken: string | null

  managedIdentity: string | null
  givenName: string
  familyName: string
  fullName: string
  email: string
  rating: number
  maxRating: number
  privacySecurity: NameValue[]
  tripOptions: NameValue[]
  notificationOptions: NameValue[]
  reviews: NameValue[]
  credits: Credits
  profile: Profile
  delegatorId: string | null
  delegateProfile: Profile | null
  delegations: Delegation[]
}

export interface PublicProfile {
  // The id is the managed identity!
  id: string | null
  age: number | null
  image: string | null
  firstName: string | null
  lastName: string | null
  address: Address | null
  interests: string[] | []
}

export interface Profile extends PublicProfile {
  consent: UserConsent | null
  // Format: ISO8601: yyyy-MM-dd
  dateOfBirth: string | null
  email: string | null
  fcmToken: string | null
  image: string | null
  phoneNumber: string | null
  searchPreferences: SearchPreferences | null
  ridePlanOptions: RidePlanOptions | null
  notificationOptions: NotificationOptions
  favoriteLocations: Place[]
  userRole: string | null
  actingRole: string | null
}

export interface ProfileSearch {
  keyword: string
  status: string
  results: PublicProfile[] | []
}

export interface UserConsent {
  acceptedTerms: boolean
  olderThanSixteen: boolean
  safetyGuidelines: boolean
}

export interface SearchPreferences {
  numPassengers: number
  maxWalkDistance: number
  luggageOptions: string[]
  allowedTravelModes: string[]
  allowFirstLegRideshare: boolean
  allowLastLegRideshare: boolean
  needsAssistance: boolean
  maxTransfers: number
}

export interface RidePlanOptions {
  ableToAssist: boolean
  maxPassengers: number
  maxTimeDetour: number
  maxDistanceDetour: number
  luggageOptions: string[]
  selectedCarRef: string
  cars: any[]
}

export interface Address {
  countryCode?: string
  houseNumber?: string
  label?: string
  locality?: string
  location?: {
    coordinates: number[]
    type: string
  }
  postalCode?: string
  stateCode?: string
  street?: string
  category?: string
}
export interface Place extends Address {
  id: number
  name: string
  ref: string
}

export interface NotificationOptions {
  tripConfirmations: boolean
  tripUpdates: boolean
  tripReminders: boolean
  messages: boolean
  shoutouts: boolean
}

export interface Credits {
  creditAmount: number
  creditHistory: any[]
}

export interface NameValue {
  name: string
  value: boolean
}

export interface Delegation {
  id: number
  activationTime: string
  delegateRef: string
  delegatorRef: string
  revocationTime: string
  submissionTime: string
  transferCode: string
}
