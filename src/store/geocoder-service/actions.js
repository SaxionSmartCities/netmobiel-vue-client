import axios from 'axios'
import config from '@/config/config'

const GEOCODER_BASE_URL = config.BASE_URL
const GRAVITEE_GEO_SERVICE_API_KEY = config.GRAVITEE_GEO_SERVICE_API_KEY

function generateHeaders(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  fetchGeocoderSuggestions: async (
    context,
    { place, area, result_types, hlStart, hlEnd }
  ) => {
    try {
      const resp = await axios.get(`${GEOCODER_BASE_URL}/geo/autosuggest`, {
        params: { place, in: area, result_types, hlStart, hlEnd },
        headers: generateHeaders(GRAVITEE_GEO_SERVICE_API_KEY),
      })
      context.commit('setGeocoderSuggestions', resp.data.suggestions)
    } catch (problem) {
      // TODO: Proper error handling.
      console.error(problem)
      context.dispatch(
        'ui/queueNotification',
        {
          message: 'Fout bij het ophalen van locatiesuggesties.',
          timeout: 0,
        },
        { root: true }
      )
    }
  },
}
