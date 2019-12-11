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
    if (payload.ridePlanOptions.cars.length == 0) {
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
    //HACK: We will take the first car for now.
    //State should have a selectedCar element.
    let request = {
      carRef: 'urn:nb:rs:car:' + payload.ridePlanOptions.selectedCarId,
      departureTime: moment(payload.selectedTime).format('YYYY-MM-DDTHH:mm:ss'),
      fromPlace: {
        label: `${payload.from.title} ${payload.from.vicinity}`,
        latitude: payload.from.position[0],
        longitude: payload.from.position[1],
      },
      toPlace: {
        label: `${payload.to.title} ${payload.to.vicinity}`,
        latitude: payload.to.position[0],
        longitude: payload.to.position[1],
      },
      remarks: 'What does this do?',
      nrSeatsAvailable: payload.ridePlanOptions.numPassengers,
      maxDetourSeconds: payload.ridePlanOptions.maxMinutesDetour * 60,
    }

    var axiosConfig = {
      method: 'POST',
      url: BASE_URL + `/rideshare/rides`,
      data: request,
      headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
    }

    axios(axiosConfig)
      .then(function(res) {
        // eslint-disable-next-line
        console.log(res)
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
  fetchRides: context => {
    const URL = BASE_URL + `/rideshare/rides`
    axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        context.commit('saveRides', resp.data)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
