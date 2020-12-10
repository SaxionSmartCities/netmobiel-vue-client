export class CarpoolState {
  cars: Car[] = []
  plannedRidesCount: number = 0
  rides: Ride[] = []
  selectedRide: Ride = {}
  search: Search = {
    licensePlate: null,
    result: {},
  }
  pastRides: Ride[] = []
  proposedRides: Ride[] = []
  inboxRides: Ride[] = []
}

export interface Car {
  id: string
  licensePlate: string
}
export interface Ride {}
export interface SearchResult {}

export interface Search {
  licensePlate: string | null
  result: SearchResult | null
}

export interface UserRef {
  userRef: string
}
