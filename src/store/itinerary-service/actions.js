import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

const BASE_URL = config.BASE_URL
const GRAVITEE_PLAN_SERVICE_API_KEY = config.GRAVITEE_PLAN_SERVICE_API_KEY

function generateHeader(key, context) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
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
}
