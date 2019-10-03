import axios from 'axios'
import config from '@/config/config'

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
    // {
    //   "carRef": "urn:nb:rs:car:5",
    //   "departureTime": "2019-10-02T09:30:00.733Z[UTC]",
    //   "fromPlace": {
    //       "label": "Station Borne",
    //       "latitude": 52.298417,
    //       "longitude": 6.749157
    //   },
    //   "nrSeatsAvailable": 2,
    //   "remarks": "A test ride from Borne to Enschede",
    //   "toPlace": {
    //       "label": "Station Enschede",
    //       "latitude": 52.221609,
    //       "longitude": 6.887536
    //   },
    //   "maxDetourMeters": 1000
    // }
  },
}
