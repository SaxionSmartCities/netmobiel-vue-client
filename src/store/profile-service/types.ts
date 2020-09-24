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
    reviews: null,
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
      fcmToken: null,
      image: null,
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
  }
}

export interface ExternalUser {
  profile: PublicProfile
  compliments: Compliment[] | []
  reviews: any
}

export interface Compliment {
  sender: any
  receiver: any
}
export interface PublicProfile {
  id: string | null
  image: string | null
  firstName: string | null
  lastName: string | null
  dateOfBirth: Date | null
  address: any
  interests: string[] | []
}

export interface ComplimentType {
  compliment: string
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
  coronaCheck: CoronaCheck
}

export interface Profile {
  id: string | null
  fcmToken: string | null
  image: string | null
  searchPreferences: SearchPreferences
  ridePlanOptions: RidePlanOptions
  favoriteLocations: any[]
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
  luggageOptions: string[] //['HANDLUGGAGE', 'GROCERIES'],
  selectedCarId: number
  cars: any[]
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
