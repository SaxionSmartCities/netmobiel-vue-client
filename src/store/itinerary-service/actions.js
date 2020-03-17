import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL
const GRAVITEE_PLANNER_SERVICE_API_KEY = config.GRAVITEE_PLANNER_SERVICE_API_KEY

function generateHeader(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  submitPlanningsRequest: (context, payload) => {
    context.commit('storePlanningRequest', payload)
    const URL = BASE_URL + '/planner/search/plan'
    const { from, to, timestamp } = payload
    const params = {
      from: `${from.title}::${from.position[0]},${from.position[1]}`,
      to: `${to.title}::${to.position[0]},${to.position[1]}`,
      nrSeats: payload.searchPreferences.numPassengers,
      modalities: payload.searchPreferences.allowedTravelModes.toString(),
      maxWalkDistance: payload.searchPreferences.maximumTransferTime,
    }
    const formattedDate = timestamp.when.format()
    if (timestamp.arriving) {
      params['arrivalTime'] = formattedDate
    } else {
      params['departureTime'] = formattedDate
    }
    context.commit('setPlanningStatus', { status: 'PENDING' })
    axios
      .get(URL, {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
        params: params,
      })
      .then(function(res) {
        context.commit('setPlanningStatus', { status: 'SUCCESS' })
        context.commit('setPlanningResults', { data: res.data })
      })
      .catch(function(error) {
        context.commit('setPlanningStatus', { status: 'FAILED' })
        context.dispatch(
          'ui/queueNotification',
          {
            message: error.response
              ? error.response.data.message
              : 'Network failure',
            timeout: 0,
          },
          { root: true }
        )
      })
  },
  storeSelectedTrip: (context, payload) => {
    const URL = BASE_URL + '/planner/trips'
    axios
      .post(URL, payload, {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
      })
      .then(response => {
        if (response.status == 201) {
          let message = 'Oproep naar de community is geplaatst'
          if (payload.legs && payload.legs.length > 0) {
            message = 'Reis bevestigd'
          }
          context.dispatch(
            'ui/queueNotification',
            { message: message, timeout: 3000 },
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
  fetchTrips: (context, payload) => {
    const offset = payload.offset
    const maxResults = payload.maxResults
    const URL = `${BASE_URL}/planner/trips?maxResults=${maxResults}&offset=${offset}`
    axios
      .get(URL, { headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY) })
      .then(response => {
        if (response.status == 200 && response.data.data.length > 0) {
          if (offset == 0) {
            context.commit('setPlannedTrips', response.data.data)
          } else {
            context.commit('appendPlannedTrips', response.data.data)
          }
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
