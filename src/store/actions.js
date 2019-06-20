import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL
const GRAVITEE_PLAN_SERVICE_API_KEY = config.GRAVITEE_PLAN_SERVICE_API_KEY
const GRAVITEE_PROFILE_SERVICE_API_KEY = config.GRAVITEE_PROFILE_SERVICE_API_KEY

function generateHeader(key, context) {
  return {
    'X-Gravitee-Api-Key': key,
    Authorization: context.state.user.accessToken,
  }
}

export default {
  submitRegistrationRequest: (context, payload) => {
    context.commit('storeRegistrationRequest', payload)

    var axiosConfig = {
      method: 'POST',
      url: BASE_URL + '/profiles',
      data: context.state.registrationRequest,
      headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY, context),
    }

    axios(axiosConfig)
      .then(function() {
        context.commit('setRegistrationStatus', { success: true, message: '' })
      })
      .catch(function(error) {
        const status = error.response.status
        var errorMsg = ''
        if (status === 422) {
          errorMsg = 'Ontbrekende data (email, voornaam of achternaam'
        } else if (status === 500) {
          errorMsg = error.response.data.message // No clue what is going on, but the server should report something about it
        } else if (status === 409) {
          errorMsg = 'Het emailadres is al in gebruik'
        }

        context.commit('setRegistrationStatus', {
          success: false,
          message: errorMsg,
        })
      })
  },
  submitPlanningsRequest: (context, payload) => {
    context.commit('storePlanningRequest', payload)

    let params = {
      fromPlace: encodeURIComponent(
        context.state.planningRequest.fromPlace.lat +
          ',' +
          context.state.planningRequest.fromPlace.lon
      ),
      toPlace: encodeURIComponent(
        context.state.planningRequest.toPlace.lat +
          ',' +
          context.state.planningRequest.toPlace.lon
      ),
    }
    var axiosConfig = {
      method: 'GET',
      url: BASE_URL + '/plans',
      params: params,
      headers: generateHeader(GRAVITEE_PLAN_SERVICE_API_KEY, context),
    }

    context.commit('setPlanningStatus', {
      status: 'PENDING',
    })

    axios(axiosConfig)
      .then(function(res) {
        context.commit('setPlanningStatus', {
          status: 'SUCCESS',
        })

        context.commit('setPlanningResults', {
          data: res.data.plan,
        })
      })
      .catch(function(error) {
        var errorMsg = error.response.data.message

        context.commit('setPlanningStatus', {
          status: 'FAILED',
          message: errorMsg,
        })
      })
  },
  fetchGeocoderSuggestions: (context, place) => {
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    const GEOCODER_BASE_URL = `http://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&query=${place}&country=NLD&beginHighlight=<b>&endHighlight=</b>`

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
  fetchGeocoderLocation: (context, locationid) => {
    const HERE_APP_ID = process.env.VUE_APP_HERE_APP_ID
    const HERE_APP_CODE = process.env.VUE_APP_HERE_APP_CODE
    const GEOCODER_BASE_URL = `http://geocoder.api.here.com/6.2/geocode.json?app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}&locationid=${locationid}&gen=9&jsonattributes=1`

    axios
      .get(GEOCODER_BASE_URL)
      .then(function(resp) {
        // TODO: Store the information in the store somewhere.
        // Structure of the response can be found here: https://developer.here.com/documentation/geocoder/topics/resource-geocode.html
        // eslint-disable-next-line
        console.log(resp.data)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
