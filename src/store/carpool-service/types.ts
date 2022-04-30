import { ExternalUser } from '@/store/profile-service/types'
import { Page } from '@/store/types'

const defaultPage = {
  offset: 0,
  count: 0,
  totalCount: 0,
  data: [],
}

export class CarpoolState {
  cars: Car[] = []
  selectedCar: Car = {}
  carSearch: CarSearch = {
    licensePlate: null,
    result: {},
  }
  selectedRide: Ride = {}
  plannedRides: Page<Ride> = defaultPage
  pastRides: Page<Ride> = defaultPage
  proposedRides: Page<Ride> = defaultPage
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
