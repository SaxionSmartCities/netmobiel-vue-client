import axios from 'axios'
import config from '@/config/config'

const GRAVITEE_GEO_SERVICE_API_KEY = config.GRAVITEE_GEO_SERVICE_API_KEY

function generateHeaders() {
  return {
    'X-Gravitee-Api-Key': GRAVITEE_GEO_SERVICE_API_KEY,
  }
}

export default {
  fetchGeocoderSuggestions: (context, place) => {
    const GEOCODER_BASE_URL = `https://dev.netmobiel.eu/gwapi/geo/suggest?place=${place}`
    axios
      .get(GEOCODER_BASE_URL, { headers: generateHeaders() })
      .then(function(resp) {
        if (resp.status == 200 && resp.data.suggestions.length > 0) {
          context.commit('setGeocoderSuggestions', resp.data.suggestions)
        }
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchGeocoderLocation: (context, payload) => {
    const GEOCODER_BASE_URL = `https://dev.netmobiel.eu/gwapi/geo/locations/${
      payload.locationId
    }`
    axios
      .get(GEOCODER_BASE_URL, { headers: generateHeaders() })
      .then(function(resp) {
        if (resp.status == 200 && resp.data.locations.length > 0) {
          let pos = resp.data.locations[0].response.view[0].result[0].location
          context.commit('setGeoLocationPicked', {
            pos: pos,
            field: payload.field,
          })
        }
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
