import { emptyPage } from '@/store/storeHelper'
import { Page } from '@/store/types'

export class ProfileState {
  complimentTypes: ComplimentType[] = []
  publicUsers: Map<string, ExternalUser> = new Map()
  // User as authenticated by Keycloak
  user: User = {
    accessToken: null,
    // Attributes from (or derived from) the token
    managedIdentity: null,
    givenName: '',
    familyName: '',
    fullName: '',
    email: '',
    roles: [],
  }
  // Profile as stored in profile service.
  profile: Profile = {
    id: null,
    age: null,
    consent: {
      acceptedTerms: false,
      olderThanSixteen: false,
      safetyGuidelines: false,
    },
    dateOfBirth: null,
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
  }
  favoriteLocations: Page<Place> = emptyPage
  // The current delegator on behalf of whom the app is used
  delegatorId: string | null = null
  // The original profile of the authenticated user (the delegate)
  delegateProfile: Profile | null = null
  delegations: Page<Delegation> = emptyPage
  delegation: Delegation | null = null
  surveyInteraction: SurveyInteraction | null = null
  search: ProfileSearch = {
    keyword: '',
    results: emptyPage,
  }
  version: Version | null = null
  sessionLog: UserSession | null = null
}

export const emptyPublicUser: ExternalUser = {
  profile: {
    id: null,
    age: null,
    image: null,
    firstName: null,
    lastName: null,
    address: null,
    interests: [],
  },
  compliments: emptyPage,
  reviews: emptyPage,
}
export interface ExternalUser {
  profile: PublicProfile
  compliments: Page<Compliment>
  reviews: Page<Review>
}

export interface UserRef {
  id: string
  firstName?: string | null
  lastName?: string | null
}

export interface Compliment {
  // Not required when submitting a review
  id?: number
  sender?: UserRef
  receiver: UserRef
  context: string
  // Read-only
  published?: string
  compliments: ComplimentType[]
}

export interface ComplimentType {
  compliment: string
}

export interface Review {
  // Not required when submitting a review
  id?: number
  sender?: UserRef
  receiver: UserRef
  context: string
  review: string
  // Read-only
  published?: string
}

export interface User {
  // Access token
  accessToken: string | null
  managedIdentity: string | null
  givenName: string
  familyName: string
  fullName: string
  email: string
  roles: string[]
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
  // Only present in the profile search list for searching delegators
  managed?: boolean
}

export interface Profile extends PublicProfile {
  consent: UserConsent | null
  // Format: ISO8601: yyyy-MM-dd
  dateOfBirth: string | null
  email: string | null
  phoneNumber: string | null
  searchPreferences: SearchPreferences | null
  ridePlanOptions: RidePlanOptions | null
  notificationOptions: NotificationOptions
  userRole: string | null
  // Transient, not immediately stored to prevent many, many profile updates
  actingRole: string | null
}

export interface ProfileSearch {
  keyword: string
  results: Page<PublicProfile>
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

export interface Delegation {
  activationTime: string
  delegate: Profile
  delegateRef: string
  delegator: Profile
  delegatorRef: string
  id: number
  revocationTime: string
  submissionTime: string
  transferCode: string
}

export interface Survey {
  surveyId: string
  displayName: string
  incentiveCode?: string
  startTime?: string
  endTime?: string
  takeDelayHours?: number
  takeIntervalHours?: number
}

export interface SurveyInteraction {
  survey: Survey
  expirationTime?: string
  invitationTime: string
  invitationCount: number
  redirectTime?: string
  redirectCount: number
  submitTime?: string
  surveyUrl: string
  urn: string
  owner?: UserRef
}

export interface Version {
  readonly commitId: string
  readonly buildTime: string
  readonly buildVersion: string
  // If the caller is not present, then we are not authenticated
  readonly caller?: UserRef
  // The effective caller is present only if different from real caller
  readonly effectiveCaller?: UserRef
}

export interface UserSession {
  readonly id?: number | undefined
  readonly sessionId?: string | undefined
  readonly ipAddress?: string | undefined
  userAgent: string
  readonly sessionStart?: string | undefined
  readonly sessionEnd?: string | undefined
  pageVisits: PageVisit[]
  readonly managedIdentity?: string | undefined
}

export interface PageVisit {
  path: string
  visitTime: string
}
