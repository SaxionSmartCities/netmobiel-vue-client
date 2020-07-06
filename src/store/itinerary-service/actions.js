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
  submitPlanningsRequest: (context, { from, to, travelTime, preferences }) => {
    context.commit('storePlanningRequest', {
      from,
      to,
      travelTime,
      preferences,
    })
    const URL = BASE_URL + '/planner/search/plan'
    const params = {
      from: `${from.label}::${from.latitude},${from.longitude}`,
      to: `${to.label}::${to.latitude},${to.longitude}`,
      nrSeats: preferences.numPassengers,
      modalities: preferences.allowedTravelModes.toString(),
      maxWalkDistance: preferences.maximumTransferTime,
      firstLegRideshare: preferences.allowFirstLegTransfer || false,
      lastLegRideshare: preferences.allowLastLegTransfer || false,
      travelTime: travelTime.when.format(),
      useAsArrivalTime: travelTime.arriving,
    }
    context.commit('setPlanningStatus', { status: 'PENDING' })
    axios
      .get(URL, {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
        params: params,
      })
      .then(response => {
        context.commit('setPlanningStatus', { status: 'SUCCESS' })
        context.commit('setPlanningResults', { data: response.data })
      })
      .catch(error => {
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
  storeSelectedTrip: (context, { from, to, nrSeats, itineraryRef }) => {
    let payload = { from, to, nrSeats, itineraryRef }
    const URL = BASE_URL + '/planner/trips'
    axios
      .post(URL, payload, {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
      })
      .then(response => {
        if (response.status == 201) {
          let message = 'Uw reis is bevestigd!'
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
          { message: 'Fout bij het opslaan van de reis.', timeout: 0 },
          { root: true }
        )
      })
  },
  storeShoutOut: (context, { from, to, timestamp, preferences }) => {
    let payload = {
      from,
      to,
      nrSeats: preferences.numPassengers,
      modalities: preferences.allowedTravelModes,
      maxWalkDistance: preferences.maximumTransferTime,
      firstLegRideshare: preferences.allowFirstLegTransfer || false,
      lastLegRideshare: preferences.allowLastLegTransfer || false,
      travelTime: timestamp.when.format(),
      useAsArrivalTime: timestamp.arriving,
      planType: 'SHOUT_OUT',
    }
    const URL = BASE_URL + '/planner/plans'
    axios
      .post(URL, payload, {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
      })
      .then(response => {
        if (response.status == 201) {
          let message = 'Oproep naar de community is geplaatst'
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
          { message: 'Fout bij het opslaan van uw oproep.', timeout: 0 },
          { root: true }
        )
      })
  },
  fetchTrips: (
    context,
    { pastTrips, offset, maxResults, until, since, sortDir }
  ) => {
    const params = {}
    params['maxResults'] = maxResults || 10
    params['offset'] = offset || 0
    until && (params['until'] = until)
    since && (params['since'] = since)
    sortDir && (params['sortDir'] = sortDir)

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
  fetchShoutOuts: (context, { latitude, longitude, maxResults }) => {
    const params = {
      maxResults: maxResults,
      location: `${latitude},${longitude}`,
      depArrRadius: constants.defaultShoutOutRadius,
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
  fetchMyShoutOuts: (context, { offset: offset }) => {
    const params = { offset, state: 'PLANNING', planType: 'SHOUT_OUT' }
    axios
      .get(BASE_URL + '/planner/plans', {
        headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
        params: params,
      })
      .then(response => {
        if (response.status === 200) {
          // When you using a offset you want to append the shoutouts and not clear the already fetched shoutouts.
          if (offset > 0)
            context.commit('appendMyShoutOuts', response.data.data)
          else context.commit('setMyShoutOuts', response.data.data)
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchShoutOut: (context, { id }) => {
    const URL = `${BASE_URL}/planner/plans/${id}`
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
