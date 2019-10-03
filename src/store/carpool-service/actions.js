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
  fetchLicense: () => {
    const plate = '17-THF-2'
    const URL = BASE_URL + `/rideshare/carLicenses?country=NL&plate=${plate}`
    axios
      .get(URL, {
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
    context.commit('addRideToList', payload)
    let request = {
      carRef: 'urn:nb:rs:car:50',
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
      nrSeatsAvailable: 2, // TODO: Get this from ridePlanOptions
      maxDetourSeconds: 15 * 60, // TODO: Get this from ridePlanOptions
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
      })
  },
  fetchRides: context => {
    const URL = BASE_URL + `/rideshare/rides`
    axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_RIDESHARE_SERVICE_API_KEY),
      })
      .then(function(resp) {
        // eslint-disable-next-line
        console.log(resp)
        context.commit('saveRides', resp.data)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
