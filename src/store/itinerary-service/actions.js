import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

const BASE_URL = config.BASE_URL
const GRAVITEE_PLANNER_SERVICE_API_KEY = config.GRAVITEE_PLANNER_SERVICE_API_KEY
const GRAVITEE_TRIP_SERVICE_API_KEY = config.GRAVITEE_TRIP_SERVICE_API_KEY

function generateHeader(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  submitPlanningsRequest: (context, payload) => {
    context.commit('storePlanningRequest', payload)
    let params = {
      fromPlace: `${payload.from.title}::${payload.from.position[0]},${
        payload.from.position[1]
      }`,
      toPlace: `${payload.to.title}::${payload.to.position[0]},${
        payload.to.position[1]
      }`,
      nrSeats: 1,
      searchPreferences: payload.searchPreferences,
    }

    if (payload.mode == 0) {
      params['toDate'] = moment(payload.time).format('YYYY-MM-DDTHH:mm')
    } else {
      params['fromDate'] = moment(payload.time).format()
    }

    var axiosConfig = {
      method: 'GET',
      url: BASE_URL + '/planner/api/search/plan',
      params: params,
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
    }

    context.commit('setPlanningStatus', {
      status: 'PENDING',
    })

    axios(axiosConfig)
      .then(function(res) {
        context.commit('setPlanningStatus', {
          status: 'SUCCESS',
        })
        console.log(res.data)
        context.commit('setPlanningResults', {
          data: res.data,
        })
      })
      .catch(function(error) {
        // eslint-disable-next-line
        console.log(error)
        context.commit('setPlanningStatus', {
          status: 'FAILED',
          message: error.response
            ? error.response.data.message
            : 'Network failure',
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
          { message: 'Fout bij het opslaan van de gekozen reis.', timeout: 0 },
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
          context.commit('setPlannedTrips', parsedTrips)
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
        context.dispatch(
          'ui/queueNotification',
          {
            message: 'Fout bij het ophalen van opgeslagen reizen.',
            timeout: 0,
          },
          { root: true }
        )
      })
  },
}
