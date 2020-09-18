import { CarpoolState, Car } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { mutations } from '@/store/carpool-service/index'
import * as uiStore from '@/store/ui'
import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

type ActionContext = BareActionContext<CarpoolState, RootState>

const BASE_URL = config.BASE_URL
const GRAVITEE_RIDESHARE_SERVICE_API_KEY =
  config.GRAVITEE_RIDESHARE_SERVICE_API_KEY

function generateHeaders(key: any) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

function fetchLicense(context: ActionContext, payload: string): void {
  mutations.setSearchLicensePlate(payload)
  const plate = payload
  const URL = BASE_URL + `/rideshare/carLicenses?country=NL&plate=${plate}`
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
  const URL = BASE_URL + `/rideshare/cars`
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
  const URL = BASE_URL + `/rideshare/cars`
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
  const URL = BASE_URL + `/rideshare/cars/${payload.id}`
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

  const axiosConfig = {
    method: 'POST',
    url: BASE_URL + `/rideshare/rides`,
    data: request,
    headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
  }

  axios(axiosConfig)
    .then(function(res) {
      // eslint-disable-next-line
      console.log(res)
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

function fetchRides(
  context: ActionContext,
  { pastRides, offset, maxResults, until, since, sortDir }: any
) {
  const URL = BASE_URL + `/rideshare/rides`
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
  const URL = `${BASE_URL}/rideshare/rides/${rideId}`
  axios
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
  const URL = `${BASE_URL}/rideshare/rides/${payload.id}/confirm/true`
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
  const URL = BASE_URL + `/rideshare/rides/` + payload.id
  //TODO: Pass reason to message service.
  axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    })
    .then(function(resp) {
      if (resp.status == 204) {
        //Delete trip from store!
        mutations.deleteRides(payload.id)
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

function fetchUser(context: ActionContext, { userRef }: any) {
  const URL = BASE_URL + `/rideshare/users/${userRef}`
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

export const buildActions = (
  csBuilder: ModuleBuilder<CarpoolState, RootState>
) => {
  return {
    fetchLicense: csBuilder.dispatch(fetchLicense),
    fetchCars: csBuilder.dispatch(fetchCars),
    submitCar: csBuilder.dispatch(submitCar),
    removeCar: csBuilder.dispatch(removeCar),
    submitRide: csBuilder.dispatch(submitRide),
    fetchRides: csBuilder.dispatch(fetchRides),
    fetchRide: csBuilder.dispatch(fetchRide),
    confirmRide: csBuilder.dispatch(confirmRide),
    deleteRide: csBuilder.dispatch(deleteRide),
    fetchUser: csBuilder.dispatch(fetchUser),
  }
}
