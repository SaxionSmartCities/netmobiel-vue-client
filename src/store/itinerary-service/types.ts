export class ItineraryState {
  selectedTrip: any = {
    from: undefined,
    to: undefined,
    date: undefined,
    itinerary: {},
  }
  shoutOuts = []
  myShoutOuts = []
  shoutOutsTotalCount = 0
  plannedTripsCount = 0
  plannedTrips = []
  pastTripsCount = 0
  pastTrips = []
  searchCriteria = {
    from: null,
    to: null,
    travelTime: null,
    preferences: null,
  }
  planningRequest = {
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

export interface ShoutOut {}
export interface Trip {}

interface PlanningRequest {
  from: any
  to: any
  travelTime: string
  preferences: any
  submitStatus: {
    status: string
    message: string
  }
  result: any
}
