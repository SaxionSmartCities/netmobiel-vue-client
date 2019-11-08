import axios from 'axios'
import config from '@/config/config'

const GEOCODER_BASE_URL =
  process.env.VUE_APP_BASE_URL || 'https://dev.netmobiel.eu/gwapi'
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
      // eslint-disable-next-line
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
