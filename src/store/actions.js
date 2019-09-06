import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

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
  queueNotification: (context, payload) => {
    context.commit('pushNotificationToQueue', payload)

    // If the notification that was just pushed is the first (in a while), set the timeout and call finishNotification after it's done.
    if (context.state.ui.notificationQueue.length == 1) {
      context.commit('showNotificationBar')
      let nextNotification = context.state.ui.notificationQueue[0]

      if (nextNotification.timeout > 0) {
        setTimeout(() => {
          console.log('setting timeout for event', nextNotification.timeout)
          context.dispatch('finishNotification')
        }, nextNotification.timeout)
      }
    }
  },
  finishNotification: context => {
    console.log('notification finished! hiding bar..')
    context.commit('hideNotificationBar')
    context.commit('popNotificationFromQueue')

    // Kick off next notification if there are others to do.
    if (context.state.ui.notificationQueue.length > 0) {
      console.log(
        'there are notifications left: ',
        context.state.ui.notificationQueue.length
      )
      console.log('showing notification bar')
      context.commit('showNotificationBar')
      let nextNotification = context.state.ui.notificationQueue[0]
      console.log('next notification', nextNotification)

      if (nextNotification.timeout > 0) {
        setTimeout(() => {
          context.dispatch('finishNotification')
        }, nextNotification.timeout)
      } else {
        console.log('nothing to set!')
      }
    }
  },
}
