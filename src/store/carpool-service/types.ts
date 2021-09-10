export class CarpoolState {
  cars: Car[] = []
  plannedRidesCount: number = 0
  rides: Ride[] = []
  selectedCar: Car = {}
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
  id?: string
  licensePlate?: string
  carRef?: string
}
export interface Ride {
  rideRef?: string
}
export interface SearchResult {}

export interface Search {
  licensePlate: string | null
  result: SearchResult | null
}

export interface UserRef {
  userRef: string
}
