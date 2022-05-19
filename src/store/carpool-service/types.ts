import { Page } from '@/store/types'

const defaultPage = {
  offset: 0,
  count: 0,
  totalCount: 0,
  data: [],
}

export class CarpoolState {
  cars: Car[] = []
  selectedCar: Car | null = null
  carSearch: CarSearch = {
    licensePlate: null,
    result: {},
  }
  selectedRide: Ride | null = null
  plannedRides: Page<Ride> = defaultPage
  pastRides: Page<Ride> = defaultPage
  proposedRides: Page<Ride> = defaultPage
}

export interface Car {
  brand: string
  carRef?: string
  id: string
  licensePlate: string
  licensePlateRaw: string
  nrSeats?: number
  model: string
  registrationCountry: string
  registrationYear?: string
  type?: string
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
  email: string
  familyName: string
  givenName: string
  id: string
  managedIdentity: string
  userRef: string
}

export interface Booking {
  arrivalTime: string
  bookingRef: string
  cancelledByDriver?: boolean
  cancelReason?: string
  confirmationReason?: string
  confirmationReasonByPassenger?: string
  confirmed?: boolean
  confirmedByPassenger?: boolean
  departureTime: string
  dropOff: Location
  fareInCredits: number
  legs?: Leg[]
  nrSeats: number
  passenger: RideshareUser
  passengerRef: string
  passengerTripPlanRef: string
  passengerTripRef: string
  paymentId: string
  paymentState: 'CANCELLED' | 'PAID' | null
  pickup: Location
  ride: Ride
  state: 'New' | 'Proposed' | 'Requested' | 'Confirmed' | 'Cancelled'
}
