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

interface Search {
  licensePlate: number | null
  result: object | null
}
