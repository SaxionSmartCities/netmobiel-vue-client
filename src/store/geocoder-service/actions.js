import axios from 'axios'
import config from '@/config/config'

const GEOCODER_BASE_URL = config.BASE_URL
const GRAVITEE_GEO_SERVICE_API_KEY = config.GRAVITEE_PLANNER_SERVICE_API_KEY

function generateHeaders(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  fetchGeocoderSuggestions: async (
    context,
    { query, area, hlStart, hlEnd }
  ) => {
    try {
      const resp = await axios.get(
        `${GEOCODER_BASE_URL}/planner/geocode-suggestions`,
        {
          params: {
            query,
            radius: 150000,
            // Default geographic center of the Netherlands (near Lunteren)
            center: area || '52.063045,5.349972',
            result_types: 'place,address',
            hls: hlStart,
            hle: hlEnd,
          },
          headers: generateHeaders(GRAVITEE_GEO_SERVICE_API_KEY),
        }
      )
      // console.log('response ', resp.data.data)
      context.commit('setGeocoderSuggestions', resp.data.data)
    } catch (problem) {
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
