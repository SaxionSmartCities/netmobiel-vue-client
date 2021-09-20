export class CarpoolState {
  cars: Car[] = []
  plannedRidesCount: number = 0
  rides: Ride[] = []
  selectedCar: Car = {}
  selectedRide: Ride = {}
  carSearch: CarSearch = {
    licensePlate: null,
    result: {},
  }
  pastRides: Ride[] = []
  proposedRides: Ride[] = []
  inboxRides: Ride[] = []
}

export interface Car {
  id?: string
  carRef?: string
  licensePlate?: string
  registrationYear?: string
  type?: string
  model?: string
}
export interface Ride {
  rideRef?: string
}
export interface CarSearchResult {}

export interface CarSearch {
  licensePlate: string | null
  result: CarSearchResult | null
}

export interface UserRef {
  userRef: string
}
