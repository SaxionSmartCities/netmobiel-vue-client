import axios from 'axios'

const GEOCODER_BASE_URL =
  process.env.VUE_APP_BASE_URL || 'https://dev.netmobiel.eu/gwapi'

export default {
  fetchGeocoderSuggestions: async (
    context,
    { place, area, result_types, hlStart, hlEnd }
  ) => {
    try {
      const resp = await axios.get(`${GEOCODER_BASE_URL}/geo/autosuggest`, {
        params: { place, in: area, result_types, hlStart, hlEnd },
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
