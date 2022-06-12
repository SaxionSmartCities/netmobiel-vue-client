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
    result: null,
  }
  selectedRide: Ride | null = null
  plannedRides: Page<Ride> = defaultPage
  pastRides: Page<Ride> = defaultPage
  proposedRides: Page<Ride> = defaultPage
  selectedBooking: Booking | null = null
}

export interface Car {
  brand: string
  carRef?: string
  co2Emission: number
  color: string
  color2: string
  deleted?: boolean
  driverRef?: string
  id: number
  licensePlate: string
  licensePlateRaw: string
  nrDoors?: number
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

export interface Recurrence {
  // The repetition interval. One week means every week. Two weeks means every two weeks.
  interval: number
  // The unit of the repetition.
  unit: 'DAY' | 'WEEK'
  // the horizon date (a local date!) limits the recurrence to a future date where the ride
  // is no longer repeated. The horizon date is exclusive.
  horizon: string | null
  // In case of unit 'week': A bitmask of day included in the recurrence. The days of the week are
  // numbered according ISO8601: 1 to 7 for Monday to Sunday. The number of the weekday corresponds
  // with the bit number plus one, i.e., bit 0 corresponds with Monday.
  daysOfWeekMask: number | null
  // The time zone of the recurrence. The zone is required to calculate the local time, as it is the
  // local departure/arrival time that is repeated. Default: Europe/Amsterdam.
  timeZone: string
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
  fromPlace: Location
  id?: number
  legs?: Leg[]
  maxDetourMeters?: number
  maxDetourSeconds?: number
  nrSeatsAvailable: number
  recurrence?: Recurrence
  rideRef?: string
  state?: string
  toPlace: Location
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

export interface CarSearch {
  licensePlate: string | null
  result: Car | null
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
