import { Moment } from 'moment'
import { SearchPreferences } from '@/store/profile-service/types'

export class ItineraryState {
  selectedTrip: Trip | null = null
  selectedTripPlan: TripPlan | null = null
  selectedShoutOut: TripPlan | null = null
  shoutOuts: TripPlan[] = []
  shoutOutsTotalCount: number = 0
  myShoutOuts: TripPlan[] = []
  myShoutOutsCount: number = 0
  plannedTripsCount: number = 0
  plannedTrips: Trip[] = []
  pastTripsCount: number = 0
  pastTrips: Trip[] = []
  cancelledTrips: Trip[] = []
  shoutoutPlanTime: any = null
  searchCriteria: SearchCriteria = {
    from: null,
    to: null,
    travelTime: null,
    preferences: null,
  }
  planningRequest: PlanningRequest = {
    from: null,
    to: null,
    travelTime: null,
    preferences: null,
    submitStatus: {
      status: 'UNSUBMITTED',
      message: '',
    },
    tripPlan: null,
  }
  bookingRequest: BookingRequest = {
    submitStatus: {
      status: 'UNSUBMITTED',
      message: '',
    },
  }
}

export interface Location {
  label?: string
  latitude: number
  longitude: number
}

export interface Traveller {
  id: number
  email: string
  familyName: string
  givenName: string
  managedIdentity: string
}

/**
 * A trip plan is the result of a search request or a shout-out creation.
 */
export interface TripPlan {
  from: Location
  to: Location
  nrSeats: number
  planRef: string
  planType: string
  itineraries: Itinerary[]
  // Format: ISO8601, including time zone (or 'Z')
  travelTime: string
  useAsArrivalTime: boolean
  traveller: Traveller
  travellerRef: string
  // Only in case of a shout-out
  referenceItinerary?: Itinerary
  earliestDepartureTime: string | null
  latestArrivalTime: string | null
  firstLegRideshare: boolean | null
  lastLegRideshare: boolean | null
  geodesicDistance: number | null
  maxTransfers: number | null
  maxWalkDistance: number | null
  modalities: string[]
}

/**
 * A trip is planned journey.
 */
export interface Trip {
  id: number | null
  tripRef: string | null
  state: string | null
  from: Location | null
  to: Location | null
  nrSeats: number | null
  itineraryRef: string
  itinerary: Itinerary | null
  traveller?: Traveller
  travellerRef: string | null
  arrivalTimeIsPinned: boolean | null
  cancelledByProvider?: boolean | null
  cancelReason?: string | null
  deleted?: boolean | null
}

export interface SubmitStatus {
  // 'UNSUBMITTED', 'PENDING', 'SUCCESS', 'FAILED'
  status: string
  message?: string
}

export interface TravelTime {
  when: Moment
  arriving: boolean
}

export interface SearchCriteria {
  from: Location | null | undefined
  to: Location | null | undefined
  travelTime: TravelTime | null | undefined
  preferences?: SearchPreferences | null | undefined
}

export interface ShoutOutSearchCriteria {
  shoutOutId: string
  from?: Location | null | undefined
  to?: Location | null | undefined
  travelTime?: TravelTime | null | undefined
}

export interface PlanningRequest extends SearchCriteria {
  submitStatus: SubmitStatus
  tripPlan: TripPlan | null
}

export interface BookingRequest {
  submitStatus?: SubmitStatus
}

export interface Itinerary {
  arrivalTime: string
  departureTime: string
  duration: number | null
  fareInCredits?: number | null
  itineraryRef: string
  score?: number
  transfers: number
  transitTime: number
  waitingTime: number
  walkDistance: number
  walkTime: number
  legs: Leg[]
}

export interface Leg {
  startTime: string
  endTime: string
  state: string
  duration: number
  distance: number
  from: string
  to: string
  traverseMode: string
  routeType?: string
  routeLongName?: string
  routeShortName?: string
  agencyName?: string
  agencyTimeZoneOffset?: string
  agencyId?: string
  headsign?: string
  driverId?: string
  driverName?: string
  vehicleId?: string
  vehicleName?: string
  vehicleLicensePlate?: string
  bookingId?: string
  legGeometry?: string
  guideSteps?: any
  routeId?: string
  tripId?: string
  bookingRequired?: boolean
  fareInCredits?: number
  confirmationRequested?: boolean
  confirmationByProviderRequested?: boolean
  confirmed?: boolean
  confirmedByProvider?: boolean
  confirmationReason?: string
  confirmationReasonByProvider?: string
  paymentId?: string
  paymentState?: string
  cancelledByProvider?: boolean
  // If set, the reference to the shout-out that this leg resolves
  shoutOutRef?: string
}
