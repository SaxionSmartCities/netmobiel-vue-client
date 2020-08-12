export class CarpoolState {
  cars: Car[] = []
  plannedRidesCount: number = 0
  rides: Ride[] = []
  selectedRide: Ride = {}
  search: Search = {
    licensePlate: null,
    result: {},
  }
}

export interface Car {}
export interface Ride {}
export interface SearchResult {}

export interface Search {
  licensePlate: string | null
  result: SearchResult | null
}
