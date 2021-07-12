import { CarpoolState, Car, UserRef } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { actions, mutations } from '@/store/carpool-service/index'
import * as uiStore from '@/store/ui'
import axios from 'axios'
import util from '@/utils/Utils'
import config from '@/config/config'

type ActionContext = BareActionContext<CarpoolState, RootState>

const { RIDESHARE_BASE_URL, GRAVITEE_RIDESHARE_SERVICE_API_KEY } = config
const { generateHeaders } = util

function fetchLicense(context: ActionContext, payload: string): void {
  mutations.setSearchLicensePlate(payload)
  const plate = payload
  const URL = `${RIDESHARE_BASE_URL}/carLicenses?country=NL&plate=${plate}`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(function(resp) {
      mutations.setSearchResult(resp.data)
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueInfoNotification(
        `Geen auto gevonden voor kenteken ${plate}.`
      )
    })
}

function fetchCars(context: ActionContext) {
  const URL = `${RIDESHARE_BASE_URL}/cars`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(function(resp) {
      if (resp.status == 200) {
        mutations.setAvailableCars(resp.data)
      }
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueInfoNotification(
        `Onbekende fout bij ophalen van de autos.`
      )
    })
}

function submitCar(context: ActionContext, payload: Car) {
  const URL = `${RIDESHARE_BASE_URL}/cars`
  axios
    .post(URL, payload, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(function(resp) {
      // eslint-disable-next-line
      console.log(resp)
      fetchCars(context)
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      if (!!error.response && error.response.status == 409) {
        uiStore.actions.queueErrorNotification(
          `Kenteken ${payload.licensePlate} is al geregistreerd.`
        )
      }
    })
}

function removeCar(context: ActionContext, payload: Car) {
  const URL = `${RIDESHARE_BASE_URL}/cars/${payload.id}`
  axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(function(resp) {
      fetchCars(context)
      // eslint-disable-next-line
      console.log(resp)
      fetchCars(context)
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      if (!!error.response && error.response.status == 403) {
        uiStore.actions.queueErrorNotification(
          `Niet toegestaan auto (${payload.licensePlate}) te verwijderen.`
        )
      } else if (!!error.response && error.response.status == 404) {
        uiStore.actions.queueErrorNotification(
          `Onbekende kenteken ${payload.licensePlate}.`
        )
      }
    })
}

function submitRide(context: ActionContext, payload: any) {
  const { from, to, ridePlanOptions, recurrence, travelTime } = payload
  if (ridePlanOptions.selectedCarId < 0) {
    uiStore.actions.queueErrorNotification('Voeg eerst een auto toe.')
    return
  }
  const request = {
    carRef: 'urn:nb:rs:car:' + ridePlanOptions.selectedCarId,
    recurrence,
    fromPlace: from,
    toPlace: to,
    remarks: 'What does this do?',
    nrSeatsAvailable: ridePlanOptions.numPassengers,
    maxDetourSeconds: ridePlanOptions.maxMinutesDetour * 60,
  }
  // Set arrival or departure time.
  const formattedDate = travelTime.when.toISOString()
  if (travelTime.arriving) {
    // @ts-ignore
    request.arrivalTime = formattedDate
  } else {
    // @ts-ignore
    request.departureTime = formattedDate
  }

  const URL = `${RIDESHARE_BASE_URL}/rides`
  axios
    .post(URL, request, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(function(res) {
      if (res.status == 201) {
        uiStore.actions.queueInfoNotification('Uw rit is opgeslagen.')
      }
      fetchRides(context, { offset: 0, maxResults: 10 })
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het versturen van uw rit-aanbod.'
      )
    })
}

function updateRide(context: ActionContext, payload: any) {
  const { ride } = payload
  const URL = `${RIDESHARE_BASE_URL}/rides/${ride.id}`
  const params: any = {}
  payload.scope && (params['scope'] = payload.scope)

  axios
    .put(URL, ride, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      params: params,
    })
    .then(function(resp) {
      // eslint-disable-next-line
      console.log(resp)
    })
}

function fetchRides(
  context: ActionContext,
  { pastRides, offset, maxResults, until, since, sortDir }: any
) {
  const URL = `${RIDESHARE_BASE_URL}/rides`
  const params: any = {}
  params['maxResults'] = maxResults || 10
  params['offset'] = offset || 0
  until && (params['until'] = until)
  since && (params['since'] = since)
  sortDir && (params['sortDir'] = sortDir)

  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      params: params,
    })
    .then(function(resp) {
      if (offset == 0) {
        pastRides
          ? mutations.savePastRides(resp.data.data)
          : mutations.saveRides(resp.data.data)
      } else {
        pastRides
          ? mutations.appendPastRides(resp.data.data)
          : mutations.appendRides(resp.data.data)
      }
      mutations.setPlannedRidesCount(resp.data.totalCount)
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
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
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(resp => {
      mutations.setSelectedRide(resp.data)
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification('Fout bij het ophalen van uw rit.')
    })
}

function confirmRide(context: ActionContext, payload: any) {
  const URL = `${RIDESHARE_BASE_URL}/rides/${payload.id}/confirm/true`
  const data = {}
  const config = {
    headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
  }
  axios
    .put(URL, data, config)
    .then(function(resp) {
      if (resp.status == 204) {
        // Ride is confirmed
        uiStore.actions.queueInfoNotification('Uw rit is bevestigd.')
        fetchRide(context, { id: payload.id })
      } else {
        uiStore.actions.queueErrorNotification(
          'Fout bij het bevestigen van uw rit.'
        )
      }
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het bevestigen van uw rit.'
      )
    })
}

function deleteRide(context: ActionContext, payload: any) {
  const URL = `${RIDESHARE_BASE_URL}/rides/${payload.id}`
  //TODO: Pass reason to message service.
  axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(function(resp) {
      if (resp.status == 204) {
        //Delete trip from store!
        mutations.deleteRides(payload.id)
      } else {
        uiStore.actions.queueErrorNotification(
          'Fout bij het verwijderen van uw rit-aanbod.'
        )
      }
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het verwijderen van uw rit-aanbod.'
      )
    })
}

function fetchUser(context: ActionContext, { userRef }: UserRef) {
  const URL = `${RIDESHARE_BASE_URL}/users/${userRef}`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(function(resp) {
      return resp.data
    })
    .catch(function(error) {
      // TODO: Proper error handling.
      // eslint-disable-next-line
      console.log(error)
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
  params.maxResults = maxResults || 10
  params.offset = offset || 0
  params.bookingState = 'PROPOSED'
  params.until = until
  params.since = since
  params.sortDir = sortDir
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      params: params,
    })
    .then(function(resp) {
      mutations.setProposedRides(resp.data.data)
    })
    .catch(function(error) {
      // eslint-disable-next-line
        console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van uw rit-aanbod.'
      )
    })
}

function fetchRidesFromConversations(context: ActionContext, payload: any) {
  let rideFetches = []
  for (let conversation of payload) {
    const URL = `${RIDESHARE_BASE_URL}/rides/${conversation.context}`
    rideFetches.push(
      axios.get(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
    )
  }
  Promise.all(rideFetches).then(values => {
    let rides = []
    for (let resp of values) {
      rides.push(resp.data)
    }
    mutations.setInboxRides(rides)
  })
}

export const buildActions = (
  csBuilder: ModuleBuilder<CarpoolState, RootState>
) => {
  return {
    fetchLicense: csBuilder.dispatch(fetchLicense),
    fetchCars: csBuilder.dispatch(fetchCars),
    submitCar: csBuilder.dispatch(submitCar),
    removeCar: csBuilder.dispatch(removeCar),
    submitRide: csBuilder.dispatch(submitRide),
    updateRide: csBuilder.dispatch(updateRide),
    fetchRides: csBuilder.dispatch(fetchRides),
    fetchRide: csBuilder.dispatch(fetchRide),
    confirmRide: csBuilder.dispatch(confirmRide),
    deleteRide: csBuilder.dispatch(deleteRide),
    fetchUser: csBuilder.dispatch(fetchUser),
    fetchRideProposals: csBuilder.dispatch(fetchRideProposals),
    fetchRidesFromConversations: csBuilder.dispatch(
      fetchRidesFromConversations
    ),
  }
}
