import axios from 'axios'

export default {
  fetchGeocoderSuggestions: (context, place) => {
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    const GEOCODER_BASE_URL = `https://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&query=${place}&country=NLD&beginHighlight=<b>&endHighlight=</b>`

    axios
      .get(GEOCODER_BASE_URL)
      .then(function(resp) {
        context.commit('setGeocoderSuggestions', resp.data.suggestions)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
            console.log(error)
      })
  },
  fetchGeocoderLocation: (context, payload) => {
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    const GEOCODER_BASE_URL = `https://geocoder.api.here.com/6.2/geocode.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&locationid=${
      payload.locationId
    }&gen=9&jsonattributes=1`

    axios
      .get(GEOCODER_BASE_URL)
      .then(function(resp) {
        let pos = resp.data.response.view[0].result[0].location
        context.commit('setGeoLocationPicked', {
          pos: pos,
          field: payload.field,
        })
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
            console.log(error)
      })
  },
}
