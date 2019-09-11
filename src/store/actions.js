import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

const BASE_URL = config.BASE_URL
const GRAVITEE_PLAN_SERVICE_API_KEY = config.GRAVITEE_PLAN_SERVICE_API_KEY
const GRAVITEE_PROFILE_SERVICE_API_KEY = config.GRAVITEE_PROFILE_SERVICE_API_KEY

function generateHeader(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  submitRegistrationRequest: (context, payload) => {
    context.commit('storeRegistrationRequest', payload)

    var axiosConfig = {
      method: 'POST',
      url: BASE_URL + '/profiles',
      data: context.state.registrationRequest,
      headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY),
    }

    axios(axiosConfig)
      .then(function() {
        context.commit('setRegistrationStatus', { success: true, message: '' })
      })
      .catch(function(error) {
        const status = error.response.status
        var errorMsg = ''
        if (status === 422) {
          errorMsg = 'Ontbrekende data (email, voornaam of achternaam)'
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
  fetchProfile: context => {
    const URL = BASE_URL + '/profiles'
    axios
      .get(URL, { headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY) })
      .then(response => {
        if (response.status == 200 && response.data.profiles.length > 0) {
          context.commit('setProfile', response.data.profiles[0])
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  submitPlanningsRequest: (context, payload) => {
    context.commit('storePlanningRequest', payload)
    let time = moment(payload.selectedTime).format('HH:mm')
    let date = moment(payload.selectedTime).format('YYYY-MM-DD')

    let data = {
      fromPlace:
        payload.from.displayPosition.latitude +
        ',' +
        payload.from.displayPosition.longitude,
      toPlace:
        payload.to.displayPosition.latitude +
        ',' +
        payload.to.displayPosition.longitude,
      selectedTime: {
        date: date,
        time: time,
      },
      ridePreferences: {
        luggage: payload.ridePreferences.luggage.map(element => element.type),
        allowedTravelModes: payload.ridePreferences.allowedTravelModes.map(
          element => element.mode
        ),
        maxMinutesWalking: payload.ridePreferences.maxMinutesWalking,
        transferAllowed: payload.ridePreferences.transferAllowed,
        nrOfPersons: payload.ridePreferences.nrOfPersons,
      },
    }

    var axiosConfig = {
      method: 'POST',
      url: BASE_URL + '/plans',
      data: data,
      headers: generateHeader(GRAVITEE_PLAN_SERVICE_API_KEY),
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
