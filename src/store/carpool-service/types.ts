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

export interface Location {
  label?: string
  latitude: number
  longitude: number
}

export interface Ride {
  ableToAssist?: boolean
  arrivalTime?: string
  arrivalTimePinned?: boolean
  bookings?: Booking[]
  cancelReason?: string | null
  car?: Car
  carRef?: string
  carthesianBearing?: number
  carthesianDistance?: number
  confirmed?: boolean
  confirmationReason?: string
  departureTime?: string
  distance?: number
  driver?: RideshareUser
  driverRef?: string
  duration?: number
  fromPlace?: Location
  id?: number
  legs?: Leg[]
  maxDetourMeters?: number
  maxDetourSeconds?: number
  nrSeatsAvailable?: number
  rideRef?: string
  state?: string
  toPlace?: Location
}

export interface Leg {
  distance: number
  duration: number
  endTime: string
  startTime: string
  state: string
  from: string
  to: string
  legGeometry?: string
  legRef?: string
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
  state?: string
  confirmed?: boolean
  confirmationReason: string
  confirmedByPassenger?: boolean
  confirmationReasonByPassenger: string
}
