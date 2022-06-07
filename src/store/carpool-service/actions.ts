import { Car, CarpoolState, Recurrence, Ride } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { mutations } from '@/store/carpool-service/index'
import * as uiStore from '@/store/ui'
import axios, { AxiosError, AxiosRequestHeaders } from 'axios'
import config from '@/config/config'
import { generateHeaders } from '@/utils/Utils'

type ActionContext = BareActionContext<CarpoolState, RootState>

const { RIDESHARE_BASE_URL, GRAVITEE_RIDESHARE_SERVICE_API_KEY } = config

function fetchByLicensePlate(context: ActionContext, payload: string): void {
  mutations.setCarSearchLicensePlate(payload)
  const plate = payload
  const URL = `${RIDESHARE_BASE_URL}/carLicenses?country=NL&plate=${plate}`
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then(function (resp) {
      mutations.setCarSearchResult(resp.data)
    })
    .catch(function (error) {
      uiStore.actions.queueInfoNotification(
        `Geen auto gevonden voor kenteken ${plate}.`
      )
    })
}

function fetchCars(context: ActionContext) {
  const URL = `${RIDESHARE_BASE_URL}/cars`
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then(function (resp) {
      if (resp.status == 200) {
        mutations.setAvailableCars(resp.data)
      }
    })
    .catch(function (error) {
      uiStore.actions.queueInfoNotification(
        `Onbekende fout bij ophalen van de auto's.`
      )
    })
}

function submitCar(context: ActionContext, payload: Car) {
  const URL = `${RIDESHARE_BASE_URL}/cars`
  axios
    .post(URL, payload, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then(function (resp) {
      fetchCars(context)
    })
    .catch(function (error) {
      if (error.response?.status == 409) {
        uiStore.actions.queueErrorNotification(
          `Kenteken ${payload.licensePlate} is al geregistreerd.`
        )
      }
    })
}

function fetchCar(context: ActionContext, payload: any) {
  const URL = `${RIDESHARE_BASE_URL}/cars/${payload.id}`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((resp) => {
      mutations.setSelectedCar(resp.data)
    })
    .catch((error) => {
      mutations.setSelectedCar(null)
    })
}

function removeCar(context: ActionContext, payload: Car) {
  const URL = `${RIDESHARE_BASE_URL}/cars/${payload.id}`
  axios
    .delete(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then(function (resp) {
      fetchCars(context)
    })
    .catch(function (error) {
      if (error.response?.status == 403) {
        uiStore.actions.queueErrorNotification(
          `Niet toegestaan auto (${payload.licensePlate}) te verwijderen.`
        )
      } else if (error.response?.status == 404) {
        uiStore.actions.queueErrorNotification(
          `Onbekend kenteken ${payload.licensePlate}.`
        )
      }
    })
}

function submitRide(context: ActionContext, payload: any) {
  const { from, to, ridePlanOptions, recurrence, travelTime } = payload
  if (!ridePlanOptions.selectedCarRef) {
    uiStore.actions.queueErrorNotification('Voeg eerst een auto toe.')
    return
  }
  const newRide: Ride = {
    carRef: ridePlanOptions.selectedCarRef,
    recurrence: recurrence as Recurrence,
    fromPlace: from,
    toPlace: to,
    nrSeatsAvailable: ridePlanOptions.maxPassengers,
    maxDetourSeconds: ridePlanOptions.maxTimeDetour
      ? ridePlanOptions.maxTimeDetour * 60
      : undefined,
    maxDetourMeters: ridePlanOptions.maxDistanceDetour,
  }
  // Set arrival or departure time.
  const formattedDate = travelTime.when.toISOString()
  if (travelTime.arriving) {
    newRide.arrivalTime = formattedDate
  } else {
    newRide.departureTime = formattedDate
  }

  const URL = `${RIDESHARE_BASE_URL}/rides`
  return axios
    .post(URL, newRide, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then(function (res) {
      if (res.status == 201) {
        uiStore.actions.queueInfoNotification('Uw rit is opgeslagen.')
      }
      return Promise.resolve()
    })
    .catch(function (problem: unknown) {
      let msg = 'Fout bij het inplannen van je rit.'
      const error = problem as Error | AxiosError
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 422 &&
          error.response.data?.message?.includes('Ride overlaps')
        ) {
          msg = 'Je nieuwe rit overlapt met een al ingeplande rit'
        } else if (
          error.response?.status === 400 &&
          error.response.data?.message?.includes('Cannot compute itinerary')
        ) {
          msg =
            'De route planner kan geen geschikte route vinden tussen de aangegeven locaties.'
        }
      }
      uiStore.actions.queueErrorNotification(msg)
      return Promise.reject()
    })
}

function updateRide(context: ActionContext, payload: any) {
  const { ride } = payload
  const URL = `${RIDESHARE_BASE_URL}/rides/${ride.rideRef}`
  const params: any = {}
  payload.scope && (params['scope'] = payload.scope)

  return axios
    .put(URL, ride, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then(function (resp) {
      // eslint-disable-next-line
      uiStore.actions.queueInfoNotification('Uw rit is gewijzigd.')
      fetchRide(context, { id: ride.rideRef })
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het wijzigen van uw rit.'
      )
    })
}

function fetchRides(
  context: ActionContext,
  { pastRides, offset, maxResults, until, since, sortDir }: any
) {
  const URL = `${RIDESHARE_BASE_URL}/rides`
  const params: any = {
    maxResults: maxResults ?? 10,
    offset: offset ?? 0,
    until: until,
    since: since,
    sortDir: sortDir,
  }
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then(function (resp) {
      if (pastRides) {
        mutations.setPastRides(resp.data)
      } else {
        mutations.setPlannedRides(resp.data)
      }
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van uw rit-aanbod.'
      )
    })
}

function fetchRide(context: ActionContext, payload: any) {
  const rideId = payload.id
  const URL = `${RIDESHARE_BASE_URL}/rides/${rideId}`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((resp) => {
      mutations.setSelectedRide(resp.data)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification('Fout bij het ophalen van je rit.')
    })
}

function confirmBookedRide(context: ActionContext, payload: any) {
  const URL = `${RIDESHARE_BASE_URL}/bookings/${payload.id}/confirm/true`
  const data = {}
  const config = {
    headers: generateHeaders(
      GRAVITEE_RIDESHARE_SERVICE_API_KEY
    ) as AxiosRequestHeaders,
  }
  return axios
    .put(URL, data, config)
    .then(function (resp) {
      if (resp.status === 204) {
        // Ride is confirmed
        uiStore.actions.queueInfoNotification(
          'Je hebt de rit van je passagier bevestigd.'
        )
      }
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het bevestigen van de rit.'
      )
    })
}

function rejectBookedRide(context: ActionContext, payload: any) {
  const URL = `${RIDESHARE_BASE_URL}/bookings/${payload.id}/confirm/false?reason=${payload.reasonCode}`
  const data = {}
  const config = {
    headers: generateHeaders(
      GRAVITEE_RIDESHARE_SERVICE_API_KEY
    ) as AxiosRequestHeaders,
  }
  return axios
    .put(URL, data, config)
    .then(function (resp) {
      if (resp.status === 204) {
        // Ride is confirmed
        uiStore.actions.queueInfoNotification(
          'Je hebt je passagier niet meegenomen.'
        )
      }
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het afwijzen van de rit.'
      )
    })
}

function unconfirmBookedRide(context: ActionContext, payload: any) {
  const URL = `${RIDESHARE_BASE_URL}/bookings/${payload.id}/unconfirm`
  const data = {}
  const config = {
    headers: generateHeaders(
      GRAVITEE_RIDESHARE_SERVICE_API_KEY
    ) as AxiosRequestHeaders,
  }
  axios
    .put(URL, data, config)
    .then(function (resp) {
      if (resp.status === 204) {
        uiStore.actions.queueInfoNotification(
          'Je kunt je rit nu opnieuw bevestigen.'
        )
      }
    })
    .catch(function (error) {
      if (error.response?.status === 403) {
        uiStore.actions.queueErrorNotification(
          'De rit is reeds afgewezen. Vraag de passagier om de bevestiging ongedaan te maken.'
        )
      } else {
        uiStore.actions.queueErrorNotification(
          'Fout bij het ongedaan maken van de bevestiging van de rit.'
        )
      }
    })
}

function deleteRide(context: ActionContext, payload: any) {
  const URL = `${RIDESHARE_BASE_URL}/rides/${payload.id}`
  const params: any = {
    scope: payload.scope || 'this',
    reason: payload.cancelReason,
  }
  return axios
    .delete(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then(function (resp) {
      if (resp.status !== 204) {
        // eslint-disable-next-line
        console.log(`DeleteRide: Unexpected status ${resp.status}`)
      }
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het verwijderen van je rit(ten).'
      )
    })
}

/**
 * Fetch the rides of the driver (i.e., the caller) having a
 * booking state 'PROPOSED'
 * @param context Store context
 * @param offset Offset in the list to retrieve
 * @param maxResults The number of results
 * @param until limit the list to rides departing before this time
 * @param since limit the list to rides departing after this time
 * @param sortDir the direction to sort the list.
 */
function fetchRideProposals(
  context: ActionContext,
  { offset, maxResults, until, since, sortDir }: any
) {
  const URL = `${RIDESHARE_BASE_URL}/rides`
  const params: any = {}
  params.maxResults = maxResults ?? 10
  params.offset = offset ?? 0
  params.bookingState = 'PROPOSED'
  params.until = until
  params.since = since
  params.sortDir = sortDir
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then(function (resp) {
      mutations.setProposedRides(resp.data)
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van je rit-aanbod.'
      )
    })
}

function fetchBooking(context: ActionContext, bookingId: any) {
  const URL = `${RIDESHARE_BASE_URL}/bookings/${bookingId}`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_RIDESHARE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((resp) => {
      mutations.setSelectedBooking(resp.data)
      return Promise.resolve(resp.data)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van je boeking.'
      )
      return Promise.resolve()
    })
}

export const buildActions = (
  csBuilder: ModuleBuilder<CarpoolState, RootState>
) => {
  return {
    fetchByLicensePlate: csBuilder.dispatch(fetchByLicensePlate),
    fetchCars: csBuilder.dispatch(fetchCars),
    submitCar: csBuilder.dispatch(submitCar),
    fetchCar: csBuilder.dispatch(fetchCar),
    removeCar: csBuilder.dispatch(removeCar),

    fetchRides: csBuilder.dispatch(fetchRides),
    fetchRide: csBuilder.dispatch(fetchRide),
    submitRide: csBuilder.dispatch(submitRide),
    updateRide: csBuilder.dispatch(updateRide),
    deleteRide: csBuilder.dispatch(deleteRide),
    confirmBookedRide: csBuilder.dispatch(confirmBookedRide),
    rejectBookedRide: csBuilder.dispatch(rejectBookedRide),
    unconfirmBookedRide: csBuilder.dispatch(unconfirmBookedRide),

    fetchRideProposals: csBuilder.dispatch(fetchRideProposals),

    fetchBooking: csBuilder.dispatch(fetchBooking),
  }
}
