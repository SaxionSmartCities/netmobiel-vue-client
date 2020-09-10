import { CarpoolState, Car } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { mutations } from '@/store/carpool-service/index'
import * as uiStore from '@/store/ui'
import axios from 'axios'
import config from '@/config/config'

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
      if (!!error.response && error.response.status == 404) {
        uiStore.actions.queueNotification({
          message: `Geen auto gevonden voor kenteken ${plate}.`,
          timeout: 3000,
        })
      } else {
        uiStore.actions.queueNotification({
          message: `Geen auto gevonden voor kenteken ${plate}.`,
          timeout: 3000,
        })
      }
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
      uiStore.actions.queueNotification({
        message: `Onbekende fout bij ophalen van de autos.`,
        timeout: 3000,
      })
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
        uiStore.actions.queueNotification({
          message: `Kenteken ${payload.licensePlate} is al geregistreerd.`,
          timeout: 0,
        })
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
        uiStore.actions.queueNotification({
          message: `Niet toegestaan auto (${payload.licensePlate}) te verwijderen.`,
          timeout: 0,
        })
      } else if (!!error.response && error.response.status == 404) {
        uiStore.actions.queueNotification({
          message: `Onbekende kenteken ${payload.licensePlate}.`,
          timeout: 0,
        })
      }
    })
}

function submitRide(context: ActionContext, payload: any) {
  const { from, to, ridePlanOptions, recurrence, travelTime } = payload
  if (ridePlanOptions.selectedCarId < 0) {
    uiStore.actions.queueNotification({
      message: 'Voeg eerst een auto toe.',
      timeout: 0,
    })
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
      uiStore.actions.queueNotification({
        message: 'Fout bij het versturen van uw rit-aanbod.',
        timeout: 0,
      })
    })
}

function fetchRides(context: ActionContext, payload: any) {
  const offset = payload.offset
  const maxResults = payload.maxResults
  const URL = BASE_URL + `/rideshare/rides`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      params: {
        offset: offset,
        maxResults: maxResults,
      },
    })
    .then(function(resp) {
      if (offset == 0) {
        mutations.saveRides(resp.data.data)
      } else {
        mutations.appendRides(resp.data.data)
      }
      mutations.setPlannedRidesCount(resp.data.totalCount)
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueNotification({
        message: 'Fout bij het ophalen van uw rit-aanbod.',
        timeout: 0,
      })
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
      uiStore.actions.queueNotification({
        message: 'Fout bij het ophalen van uw rit.',
        timeout: 0,
      })
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
        uiStore.actions.queueNotification({
          message: 'Fout bij het verwijderen van uw rit-aanbod.',
          timeout: 0,
        })
      }
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueNotification({
        message: 'Fout bij het verwijderen van uw rit-aanbod.',
        timeout: 0,
      })
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
    deleteRide: csBuilder.dispatch(deleteRide),
    fetchUser: csBuilder.dispatch(fetchUser),
  }
}
