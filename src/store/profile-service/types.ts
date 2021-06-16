import { LocalDate } from '@js-joda/core'

export class ProfileState {
  complimentTypes: ComplimentType[] = []
  externalUser: ExternalUser = {
    profile: {
      id: null,
      image: null,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      address: {},
      interests: [],
    },
    compliments: [],
    reviews: [],
  }
  user: User = {
    // Access token
    accessToken: null,

    // Credentials provided by identity provider.
    givenName: '',
    familyName: '',
    fullName: '',
    email: '',
    rating: 2,
    maxRating: 3,

    // Profile as stored in profile service.
    profile: {
      id: null,
      consent: {
        acceptedTerms: false,
        olderThanSixteen: false,
      },
      dateOfBirth: null,
      fcmToken: null,
      firstName: null,
      lastName: null,
      image: null,
      email: null,
      phoneNumber: null,
      userRole: [],
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
    coronaCheck: {
      coronaSymptoms: false,
      houseHoldHadCorona: false,
    },
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

  // Credentials provided by identity provider.
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
  coronaCheck: CoronaCheck
  delegations: Delegation[]
}

export interface PublicProfile {
  id: string | null
  image: string | null
  firstName: string | null
  lastName: string | null
  dateOfBirth: LocalDate | null
  address: any
  interests: string[] | []
}

export interface Profile extends PublicProfile {
  consent: UserConsent | null
  email: string | null
  fcmToken: string | null
  image: string | null
  phoneNumber: string | null
  searchPreferences: SearchPreferences | null
  ridePlanOptions: RidePlanOptions | null
  notificationOptions: NotificationOptions
  favoriteLocations: Place[]
  userRole: string[] | []
}

export interface ProfileSearch {
  keyword: string
  status: string
  results: PublicProfile[] | []
}

export interface UserConsent {
  acceptedTerms: boolean
  olderThanSixteen: boolean
}

export interface SearchPreferences {
  numPassengers: number
  allowTransfer: boolean
  maximumTransferTime: number
  luggageOptions: string[]
  allowedTravelModes: string[]
}

export interface RidePlanOptions {
  numPassengers: number
  maxMinutesDetour: number
  luggageOptions: string[]
  selectedCarId: number
  cars: any[]
}

export interface Place {
  id: number
  ref: string
  countryCode?: string
  houseNumber?: string
  label: string
  locality?: string
  location: {
    coordinates: number[]
    type: string
  }
  postalCode?: string
  stateCode?: string
  street?: string
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

export interface CoronaCheck {
  coronaSymptoms: boolean
  houseHoldHadCorona: boolean
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
