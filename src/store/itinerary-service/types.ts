export class ItineraryState {
  selectedTrip: any = {
    from: undefined,
    to: undefined,
    date: undefined,
    itinerary: {},
  }
  shoutOuts: ShoutOut[] = []
  shoutOutsTotalCount: number = 0
  myShoutOuts: ShoutOut[] = []
  myShoutOutsCount: number = 0
  plannedTripsCount: number = 0
  plannedTrips: Trip[] = []
  pastTripsCount: number = 0
  pastTrips: Trip[] = []
  searchCriteria: SearchCriteria = {
    from: null,
    to: null,
    travelTime: null,
    preferences: null,
  }
  shoutoutPlanTime: any = null
  planningRequest: PlanningRequest = {
    from: null,
    to: null,
    travelTime: null,
    preferences: null,
    submitStatus: {
      status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
      message: '',
    },
    result: null,
  }
  bookingRequest: BookingRequest = {
    submitStatus: {
      status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
      message: '',
    },
  }
  cancelledTrips: Trip[] = []
}

export interface Location {
  label: string
  latitude: number
  longitude: number
}

export interface TripSelection {
  from: Location
  to: Location
  nrSeats: number
  itineraryRef: string
}

export interface ShoutOut {
  from: Location
  to: Location
  nrSeats: number
  planRef: string
  itineraries: Itinerary[]
  travelTime: string
  useAsArrivalTime: boolean
  traveller: Traveller
  ride: Ride | null
}

export interface Ride {
  id: number
  rideRef: string
  state: string
  fromPlace: Location
  toPlace: Location
  distance: number
  arrivalTime: string
  departureTime: string
  car: Car
  carRef: string
  bookings: Booking[]
}

export interface Booking {
  bookingRef: string
  state: string
  arrivalTime: string
  departureTime: string
  pickup: Location
  dropOff: Location
  passenger: Traveller
  nrSeats: number
}

export interface Car {
  brand: string
  model: string
}

export interface Traveller {
  id: number
  email: string
  familyName: string
  givenName: string
  managedIdentity: string
}

export interface Trip {
  id: number
  tripRef: string
  state: string
  from: Location
  to: Location
  nrSeats: number
  itineraryRef: string
  itinerary: any
}

export interface SubmitStatus {
  status?: string
  message?: string
}

export interface SearchCriteria {
  from: any
  to: any
  travelTime: any
  preferences?: any
}

export interface PlanningRequest extends SearchCriteria {
  submitStatus?: SubmitStatus
  result?: PlanningResult | null
}

export interface PlanningResult {
  data: any
}

export interface BookingRequest {
  submitStatus?: SubmitStatus
}

export interface Itinerary {}
