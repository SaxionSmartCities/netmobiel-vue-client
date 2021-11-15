import { ExternalUser } from '@/store/profile-service/types'

export class CarpoolState {
  cars: Car[] = []
  selectedCar: Car = {}
  carSearch: CarSearch = {
    licensePlate: null,
    result: {},
  }
  plannedRidesCount: number = 0
  rides: Ride[] = []
  selectedRide: Ride = {}
  pastRidesCount: number = 0
  pastRides: Ride[] = []
  proposedRides: Ride[] = []
  inboxRides: Ride[] = []
  users: Map<string, RideshareUser> = new Map()
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
  departureTime?: string
  arrivalTime?: string
  arrivalTimePinned?: boolean
  bookings?: Booking[]
}
export interface CarSearchResult {}

export interface CarSearch {
  licensePlate: string | null
  result: CarSearchResult | null
}

export interface UserRef {
  userRef: string
}

export interface RideshareUser {
  userRef: string
  managedIdentity: string
  familyName: string
  givenName: string
  id: string
  email: string
}

export interface Booking {
  bookingRef?: string
  departureTime?: string
  arrivalTime?: string
  passenger?: RideshareUser
  passengerRef?: string
}
