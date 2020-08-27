export class ItineraryState {
  selectedTrip: any = {
    from: undefined,
    to: undefined,
    date: undefined,
    itinerary: {},
  }
  shoutOuts: ShoutOut[] = []
  myShoutOuts: ShoutOut[] = []
  shoutOutsTotalCount: number = 0
  plannedTripsCount: number = 0
  plannedTrips: Trip[] = []
  pastTripsCount: number = 0
  pastTrips: Trip[] = []
  searchCriteria = {
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
      status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
      message: '',
    },
    result: null,
  }
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

export interface ShoutOut {}

export interface Trip {}

export interface SubmitStatus {
  status?: string
  message?: string
}

export interface PlanningRequest {
  from: any
  to?: any
  travelTime: any
  preferences?: any
  submitStatus?: SubmitStatus
  result?: PlanningResult | null
}

export interface PlanningResult {
  data: any
}

export interface Itinerary {}
