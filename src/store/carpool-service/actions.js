import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

const BASE_URL = config.BASE_URL
const GRAVITEE_RIDESHARE_SERVICE_API_KEY =
  config.GRAVITEE_RIDESHARE_SERVICE_API_KEY

function generateHeaders(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  fetchLicense: (context, payload) => {
    context.commit('setSearchLicensePlate', payload)
    const plate = payload
    const URL = BASE_URL + `/rideshare/carLicenses?country=NL&plate=${plate}`
    axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        context.commit('setSearchResult', resp.data)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
        if (!!error.response && error.response.status == 404) {
          context.dispatch(
            'ui/queueNotification',
            {
              message: `Geen auto gevonden voor kenteken ${plate}.`,
              timeout: 3000,
            },
            { root: true }
          )
        } else {
          context.dispatch(
            'ui/queueNotification',
            {
              message: `Geen auto gevonden voor kenteken ${plate}.`,
              timeout: 3000,
            },
            { root: true }
          )
        }
      })
  },
  submitCar: (context, payload) => {
    const URL = BASE_URL + `/rideshare/cars`
    axios
      .post(URL, payload, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        // eslint-disable-next-line
        console.log(resp)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
        if (!!error.response && error.response.status == 409) {
          context.dispatch(
            'ui/queueNotification',
            {
              message: `Kenteken ${payload.licensePlate} is al geregistreerd.`,
              timeout: 0,
            },
            { root: true }
          )
        }
      })
  },
  removeCar: (context, payload) => {
    const URL = BASE_URL + `/rideshare/cars/${payload.id}`
    axios
      .delete(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        // eslint-disable-next-line
        console.log(resp)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  submitRide: (context, payload) => {
    const { ridePlanOptions, selectedTime, from, to, recurrence } = payload
    if (ridePlanOptions.cars.length == 0) {
      context.dispatch(
        'ui/queueNotification',
        {
          message: 'Voeg eerst een auto toe.',
          timeout: 0,
        },
        { root: true }
      )
      return
    }
    const request = {
      carRef: 'urn:nb:rs:car:' + ridePlanOptions.selectedCarId,
      // only departure time possible?
      // this conflicts with UI that supports departure or arrival time
      departureTime: moment(selectedTime).format('YYYY-MM-DDTHH:mm:ss'),
      recurrence,
      fromPlace: {
        label: `${from.title} ${from.vicinity}`,
        latitude: from.position[0],
        longitude: from.position[1],
      },
      toPlace: {
        label: `${to.title} ${to.vicinity}`,
        latitude: to.position[0],
        longitude: to.position[1],
      },
      remarks: 'What does this do?',
      nrSeatsAvailable: ridePlanOptions.numPassengers,
      maxDetourSeconds: ridePlanOptions.maxMinutesDetour * 60,
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
        context.dispatch('fetchRides')
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)

        context.dispatch(
          'ui/queueNotification',
          {
            message: 'Fout bij het versturen van uw rit-aanbod.',
            timeout: 0,
          },
          { root: true }
        )
      })
  },
  fetchRides: (context, payload) => {
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
          context.commit('saveRides', resp.data)
        } else {
          context.commit('appendRides', resp.data)
        }
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
        context.dispatch(
          'ui/queueNotification',
          {
            message: 'Fout bij het ophalen van uw rit-aanbod.',
            timeout: 0,
          },
          { root: true }
        )
      })
  },
  deleteRide: (context, payload) => {
    const URL = BASE_URL + `/rideshare/rides/` + payload.id
    if (payload.cancelReason != '') {
      // ADD MESSAGE HERE
      console.log(payload.cancelReason)
    }
    axios
      .delete(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        console.log(resp)
        if (resp.status == 204) {
          //Delete trip from store!
          context.commit('deleteRides', payload.id)
        } else {
          console.log('something wrong!', resp)
        }
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
