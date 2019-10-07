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

        context.dispatch(
          'ui/queueNotification',
          {
            message: 'Fout bij het ophalen van kentekendata.',
            timeout: 0,
          },
          { root: true }
        )
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
      carRef: 'urn:nb:rs:car:' + payload.ridePlanOptions.cars[0].id,
      departureTime: moment(payload.selectedTime)
        .utc()
        .format(),
      fromPlace: {
        label: payload.from.address.label,
        latitude: payload.from.displayPosition.latitude,
        longitude: payload.from.displayPosition.longitude,
      },
      toPlace: {
        label: payload.to.address.label,
        latitude: payload.to.displayPosition.latitude,
        longitude: payload.to.displayPosition.longitude,
      },
      remarks: 'What does this do?',
      nrSeatsAvailable: payload.ridePlanOptions.numPassengers,
      maxDetourSeconds: payload.ridePlanOptions.maxMinutesDetour,
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
