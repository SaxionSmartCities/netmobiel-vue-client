import axios from 'axios'
import config from '@/config/config'
import constants from '../../constants/constants'

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
  deleteSelectedTrip: (context, payload) => {
    const URL = BASE_URL + `/planner/trips/${payload.tripId}`
    axios
      .delete(URL, {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
      })
      .then(response => {
        if (response.status === 204) {
          //Succesful response, trip is deleted.
          context.dispatch(
            'ui/queueNotification',
            { message: 'Reis is succesvol geannuleerd', timeout: 3000 },
            { root: true }
          ),
            context.dispatch('fetchTrips', {
              maxResults: constants.fetchTripsMaxResults,
              offset: 0,
            })
        } else if (response.status === 404) {
          //requested trip could not be found
          context.dispatch(
            'ui/queueNotification',
            {
              message: 'De opgegeven reis kon niet worden gevonden.',
              timeout: 0,
            },
            { root: true }
          )
        } else if (response.status === 401) {
          //The requested object does no longer exist
          context.dispatch(
            'ui/queueNotification',
            { message: 'Deze reis is al geannuleerd', timeout: 0 },
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
          { message: 'fout bij het annuleren van de reis', timeout: 0 },
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
          { message: 'Fout bij het annuleren van de reis.', timeout: 0 },
          { root: true }
        )
      })
  },
  fetchTrips: (context, { pastTrips, offset, maxResults, until, since }) => {
    const params = {}
    params['maxResults'] = maxResults || 10
    params['offset'] = offset || 0
    until && (params['until'] = until)
    since && (params['since'] = since)

    const URL = `${BASE_URL}/planner/trips`
    axios
      .get(URL, {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
        params: params,
      })
      .then(response => {
        if (response.status === 200 && response.data.data.length > 0) {
          if (offset === 0) {
            pastTrips
              ? context.commit('setPastTrips', response.data.data)
              : context.commit('setPlannedTrips', response.data.data)
          } else {
            pastTrips
              ? context.commit('appendPastTrips', response.data.data)
              : context.commit('appendPlannedTrips', response.data.data)
          }
          pastTrips
            ? context.commit('setPastTripsCount', response.data.totalCount)
            : context.commit('setPlannedTripsCount', response.data.totalCount)
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
  fetchShoutOuts: (
    context,
    { latitude: lat = 52.2224, longitude: lon = 5.28248, maxResults }
  ) => {
    const params = {
      maxResults: maxResults,
      location: `${lat},${lon}`,
      depArrRadius: 1000000,
    }
    axios
      .get(BASE_URL + '/planner/shout-outs', {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
        params: params,
      })
      .then(response => {
        if (response.status === 200) {
          context.commit('setShoutOutsTotalCount', response.data.totalCount)
          response.data.data.length > 0 &&
            context.commit('setShoutOuts', response.data.data)
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchTrip: (context, payload) => {
    const tripId = payload.id
    const URL = `${BASE_URL}/planner/trips/${tripId}`
    axios
      .get(URL, { headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY) })
      .then(response => {
        if (response.status == 200) {
          context.commit('setSelectedTrip', response.data)
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
        context.dispatch(
          'ui/queueNotification',
          {
            message: 'Fout bij het ophalen van de reis.',
            timeout: 0,
          },
          { root: true }
        )
      })
  },
}
