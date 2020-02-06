import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

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
    const URL = BASE_URL + '/planner/trips'
    axios
      .get(URL, { headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY) })
      .then(response => {
        if (response.status == 200 && response.data.length > 0) {
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
  createTripWithoutItineraries: (context, payload) => {
    const URL = BASE_URL + '/planner/trips'
    const body = {
      from: payload.from,
      to: payload.to,
    }
    const config = {
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
    }

    if (payload.arrivalTime) {
      body.arrivalTime = payload.arrivalTime
      const sameDayMidnight = moment(payload.arrivalTime)
        .startOf('day')
        .toString()
      body.departureTime = sameDayMidnight //Set to midnight same day
    } else {
      body.departureTime = payload.departureTime
      const nextDayMidnight = moment(payload.departureTime)
        .add(1, 'day')
        .startOf('day')
        .toString()
      body.arrivalTime = nextDayMidnight //Set to midnight next day
    }

    console.log('sending this body : ', body)
    axios
      .post(URL, body, config)
      .then(resp => {
        console.log('response from server: ', resp)
      })
      .catch(error => {
        console.log('ERROR while createTripWithoutItineraries', error)
      })
  },
}
