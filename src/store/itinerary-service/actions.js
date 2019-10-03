import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

const BASE_URL = config.BASE_URL
const GRAVITEE_PLAN_SERVICE_API_KEY = config.GRAVITEE_PLAN_SERVICE_API_KEY
const GRAVITEE_TRIP_SERVICE_API_KEY = config.GRAVITEE_TRIP_SERVICE_API_KEY

function generateHeader(key) {
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
      searchPreferences: {
        luggage: payload.searchPreferences.luggageOptions.map(
          element => element.type
        ),
        allowedTravelModes: payload.searchPreferences.allowedTravelModes.map(
          element => element.mode
        ),
        maxMinutesWalking: payload.searchPreferences.maxMinutesWalking,
        transferAllowed: payload.searchPreferences.transferAllowed,
        numPassengers: payload.searchPreferences.numPassengers,
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
  storeSelectedTrip: (context, payload) => {
    const URL = BASE_URL + '/trips'
    axios
      .post(URL, payload, {
        headers: generateHeader(GRAVITEE_TRIP_SERVICE_API_KEY),
      })
      .then(response => {
        if (response.status == 201) {
          context.dispatch(
            'ui/queueNotification',
            { message: 'Reis bevestigd', timeout: 3000 },
            { root: true }
          )
        } else {
          context.dispatch(
            'ui/queueNotification',
            { message: response.data.message, timeout: 0 },
            { root: true }
          )
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
        context.dispatch(
          'ui/queueNotification',
          { message: 'Reis is niet opgeslagen', timeout: 0 },
          { root: true }
        )
      })
  },
  fetchTrips: context => {
    const URL = BASE_URL + '/trips'
    axios
      .get(URL, { headers: generateHeader(GRAVITEE_TRIP_SERVICE_API_KEY) })
      .then(response => {
        if (response.status == 200 && response.data.trips.length > 0) {
          // Convert date to epochs.
          let parsedTrips = response.data.trips.map(trip => {
            trip.date = moment(trip.date).valueOf()
            return trip
          })
          context.commit('setPlannedTrips', response.data.trips)
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
        context.dispatch(
          'ui/queueNotification',
          { message: 'Fout bij het ophalen reizen', timeout: 0 },
          { root: true }
        )
      })
  },
}
