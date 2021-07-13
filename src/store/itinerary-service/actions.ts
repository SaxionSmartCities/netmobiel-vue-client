import axios from 'axios'
import moment from 'moment'
import util from '@/utils/Utils'
import config from '@/config/config'
import constants from '../../constants/constants'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { RootState } from '../Rootstate'
import { mutations } from '@/store/itinerary-service/index'
import {
  ItineraryState,
  TripSelection,
  SearchCriteria,
} from '@/store/itinerary-service/types'
import * as uiStore from '@/store/ui'
import { addInterceptors } from '../api-middelware'

type ActionContext = BareActionContext<ItineraryState, RootState>

const { PLANNER_BASE_URL, GRAVITEE_PLANNER_SERVICE_API_KEY } = config
const { generateHeaders } = util

// ============  TRIP PLAN MANAGEMENT  ================
// Creates a regular TripPlan on success

function searchTripPlan(context: ActionContext, searchCiteria: SearchCriteria) {
  mutations.storePlanningRequest(searchCiteria)
  const URL = `${PLANNER_BASE_URL}/search/plan`
  const { from, to, travelTime, preferences } = searchCiteria
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
  mutations.setPlanningStatus({ status: 'PENDING', message: '' })
  const delegatorId = context.rootState.ps.user.delegatorId
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
      params: params,
    })
    .then(response => {
      mutations.setPlanningResults({ data: response.data })
      mutations.setPlanningStatus({ status: 'SUCCESS' })
    })
    .catch(error => {
      mutations.setPlanningStatus({ status: 'FAILED' })
      uiStore.actions.queueErrorNotification(
        error.response ? error.response.data.message : 'Network failure'
      )
    })
}

function createShoutOutTripPlan(
  context: ActionContext,
  { from, to, travelTime, preferences }: any
) {
  let payload = {
    from,
    to,
    nrSeats: preferences.numPassengers,
    modalities: preferences.allowedTravelModes,
    maxWalkDistance: preferences.maximumTransferTime,
    firstLegRideshare: preferences.allowFirstLegTransfer || false,
    lastLegRideshare: preferences.allowLastLegTransfer || false,
    travelTime: travelTime.when.format(),
    useAsArrivalTime: travelTime.arriving,
    planType: 'SHOUT_OUT',
  }
  const URL = `${PLANNER_BASE_URL}/plans`
  let instance = axios.create()
  addInterceptors(instance)
  instance
    .post(URL, payload, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status == 201) {
        let message = 'Oproep naar de community is geplaatst'
        uiStore.actions.queueInfoNotification(message)
      } else {
        let message = response.data.message
        uiStore.actions.queueErrorNotification(message)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het opslaan van uw oproep.'
      )
    })
}

function fetchTripPlan(context: ActionContext, { id }: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PLANNER_BASE_URL}/plans/${id}`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
    })
    .then(response => {
      if (response.status == 200) {
        mutations.setSelectedTrip(response.data)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification('Fout bij het ophalen van de rit.')
    })
}

function fetchMyShoutOutTripPlans(
  context: ActionContext,
  { offset: offset }: any
) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const params = {
    offset,
    inProgressOnly: true,
    planType: 'SHOUT_OUT',
    since: moment().format(),
  }
  axios
    .get(`${PLANNER_BASE_URL}/plans`, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
      params: params,
    })
    .then(response => {
      if (response.status === 200) {
        mutations.setMyShoutOutsTotalCount(response.data.totalCount)
        // When you using a offset you want to append the shoutouts and not clear the already fetched shoutouts.
        if (offset > 0) mutations.appendMyShoutOuts(response.data.data)
        else mutations.setMyShoutOuts(response.data.data)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

// Cancel a shout-out trip plan
function cancelTripPlan(context: ActionContext, { shoutoutPlanId }: any) {
  const URL = `${PLANNER_BASE_URL}/plans/${shoutoutPlanId}`
  axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status == 204) {
        uiStore.actions.queueInfoNotification('Je oproep is verwijderd')
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het verwijderen van uw oproep.'
      )
    })
}

// ============  TRIP MANAGEMENT  ================

function createTrip(context: ActionContext, payload: TripSelection) {
  const delegatorId = context.rootState.ps.user.delegatorId
  mutations.setBookingStatus({ status: 'PENDING' })
  const URL = `${PLANNER_BASE_URL}/trips`
  axios
    .post(URL, payload, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
    })
    .then(response => {
      if (response.status == 201) {
        let message = 'Uw rit is bevestigd!'
        uiStore.actions.queueInfoNotification(message)
        mutations.setBookingStatus({ status: 'SUCCESS' })
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
        mutations.setBookingStatus({ status: 'FAILED' })
      }
    })
    .catch(error => {
      mutations.setBookingStatus({ status: 'FAILED' })
      // eslint-disable-next-line
      console.log(error)
      if (error.response.status == 402) {
        uiStore.actions.queueErrorNotification(
          'U heeft onvoldoende credits voor deze rit'
        )
      } else {
        uiStore.actions.queueErrorNotification(
          'Fout bij het opslaan van de rit.'
        )
      }
    })
}

function fetchTrips(
  context: ActionContext,
  { pastTrips, offset, maxResults, until, since, sortDir }: any
) {
  const params: any = {}
  params['maxResults'] = maxResults || constants.defaultMaxResults
  params['offset'] = offset || 0
  until && (params['until'] = until)
  since && (params['since'] = since)
  sortDir && (params['sortDir'] = sortDir)

  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PLANNER_BASE_URL}/trips`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
      params: params,
    })
    .then(response => {
      if (response.status === 200) {
        if (offset === 0) {
          pastTrips
            ? mutations.setPastTrips(response.data.data)
            : mutations.setPlannedTrips(response.data.data)
        } else {
          pastTrips
            ? mutations.appendPastTrips(response.data.data)
            : mutations.appendPlannedTrips(response.data.data)
        }
        pastTrips
          ? mutations.setPastTripsCount(response.data.totalCount)
          : mutations.setPlannedTripsCount(response.data.totalCount)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van opgeslagen ritten.'
      )
    })
}

function fetchCancelledTrips(context: ActionContext) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const params: any = { state: 'CANCELLED' }
  const URL = `${PLANNER_BASE_URL}/trips`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
      params: params,
    })
    .then(response => {
      mutations.setCancelledTrips(response.data.data)
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van geannuleerde ritten.'
      )
    })
}

function fetchTrip(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const tripId = payload.id
  const URL = `${PLANNER_BASE_URL}/trips/${tripId}`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
    })
    .then(response => {
      if (response.status == 200) {
        mutations.setSelectedTrip(response.data)
      }
      return response.data
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification('Fout bij het ophalen van de rit.')
    })
}

function deleteTrip(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PLANNER_BASE_URL}/trips/${payload.tripId}`
  axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
    })
    .then(response => {
      if (response.status === 204) {
        //Succesful response, trip is deleted.
        if (payload.displayWarning) {
          uiStore.actions.queueInfoNotification('Rit is succesvol geannuleerd')
        }
        fetchTrips(context, {
          maxResults: constants.fetchTripsMaxResults,
          offset: 0,
        })
      } else if (response.status === 404) {
        //requested trip could not be found
        uiStore.actions.queueErrorNotification(
          'De opgegeven rit kon niet worden gevonden.'
        )
      } else if (response.status === 401) {
        //The requested object does no longer exist
        uiStore.actions.queueErrorNotification('Deze rit is al geannuleerd')
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het annuleren van de rit'
      )
    })
}

function putTripConfirmation({ id, delegatorId, acknowledge }: any) {
  const URL = `${PLANNER_BASE_URL}/trips/${id}/confirm/${acknowledge}`
  const data = {}
  const config = {
    headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
  }
  let instance = axios.create()
  addInterceptors(instance)
  return instance.put(URL, data, config)
}

function rejectTrip(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const promise = putTripConfirmation({
    id: payload.id,
    delegatorId: delegatorId,
    acknowledge: false,
  })
  promise
    .then(resp => {
      if (resp.status == 204) {
        // Ride is confirmed
        uiStore.actions.queueInfoNotification('Uw rit is bevestigd.')
        fetchTrip(context, { id: payload.id })
      } else {
        uiStore.actions.queueErrorNotification(
          'Fout bij het bevestigen van uw rit.'
        )
      }
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het bevestigen van uw rit.'
      )
    })
}

function confirmTrip(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const promise = putTripConfirmation({
    id: payload.id,
    delegatorId: delegatorId,
    acknowledge: true,
  })
  promise
    .then(function(resp) {
      if (resp.status == 204) {
        // Ride is confirmed
        uiStore.actions.queueInfoNotification('Uw rit is bevestigd.')
        fetchTrip(context, { id: payload.id })
      } else {
        uiStore.actions.queueErrorNotification(
          'Fout bij het bevestigen van uw rit.'
        )
      }
    })
    .catch(function(error) {
      // eslint-disable-next-line
      console.log(error)
      if (error.response.status === 400) {
        uiStore.actions.queueErrorNotification('Deze rit is al bevestigd.')
      } else {
        uiStore.actions.queueErrorNotification(
          'Fout bij het bevestigen van uw rit.'
        )
      }
    })
}

// ============  SHOUT-OUT MANAGEMENT  ================
// driver calls!

function addShoutOutTravelOffer(
  context: ActionContext,
  { shoutoutPlanId, planRef, vehicleRef, driverRef }: any
) {
  let payload = { planRef, vehicleRef, driverRef }
  const URL = `${PLANNER_BASE_URL}/shout-outs/${shoutoutPlanId}`
  axios
    .post(URL, payload, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status == 202) {
        let message = 'Je aanbod is verstuurd'
        uiStore.actions.queueInfoNotification(message)
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het opslaan van uw oproep.'
      )
    })
}

function fetchShoutOut(context: ActionContext, { id }: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PLANNER_BASE_URL}/shout-outs/${id}`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY, delegatorId),
    })
    .then(response => {
      if (response.status == 200) {
        mutations.setSelectedTrip(response.data)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification('Fout bij het ophalen van de rit.')
    })
}

function fetchShoutOuts(
  context: ActionContext,
  { latitude, longitude, maxResults }: any
) {
  const params = {
    maxResults: maxResults,
    location: `${latitude},${longitude}`,
    depArrRadius: constants.defaultShoutOutRadius,
  }
  axios
    .get(`${PLANNER_BASE_URL}/shout-outs`, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
      params: params,
    })
    .then(response => {
      if (response.status === 200) {
        mutations.setShoutOutsTotalCount(response.data.totalCount)
        mutations.setShoutOuts(response.data.data)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function planShoutOutSolution(context: ActionContext, payload: any) {
  const { id, from, to = {}, travelTime } = payload
  const URL = `${PLANNER_BASE_URL}/shout-outs/${id}/plan`
  const params: any = {
    from: `${from.label}::${from.latitude},${from.longitude}`,
  }
  if (travelTime) {
    params.travelTime = travelTime.when.format()
    params.useAsArrivalTime = travelTime.arriving
  }
  mutations.storePlanningRequest({ from, to, travelTime })
  mutations.setPlanningStatus({ status: 'PENDING' })
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
      params: params,
    })
    .then(response => {
      mutations.setPlanningStatus({ status: 'SUCCESS' })
      mutations.setPlanningResults({ data: response.data })
    })
    .catch(error => {
      mutations.setPlanningStatus({ status: 'FAILED' })
      uiStore.actions.queueErrorNotification(
        error.response ? error.response.data.message : 'Network failure'
      )
    })
}

export const buildActions = (
  isBuilder: ModuleBuilder<ItineraryState, RootState>
) => {
  return {
    // Trip Plan Handling
    searchTripPlan: isBuilder.dispatch(searchTripPlan),
    createShoutOutTripPlan: isBuilder.dispatch(createShoutOutTripPlan),
    fetchTripPlan: isBuilder.dispatch(fetchTripPlan),
    fetchMyShoutOutTripPlans: isBuilder.dispatch(fetchMyShoutOutTripPlans),
    cancelTripPlan: isBuilder.dispatch(cancelTripPlan),

    // Trip handling
    createTrip: isBuilder.dispatch(createTrip),
    fetchTrips: isBuilder.dispatch(fetchTrips),
    fetchCancelledTrips: isBuilder.dispatch(fetchCancelledTrips),
    fetchTrip: isBuilder.dispatch(fetchTrip),
    deleteTrip: isBuilder.dispatch(deleteTrip),
    rejectTrip: isBuilder.dispatch(rejectTrip),
    confirmTrip: isBuilder.dispatch(confirmTrip),

    // Shout-out handling for drivers
    fetchShoutOuts: isBuilder.dispatch(fetchShoutOuts),
    fetchShoutOut: isBuilder.dispatch(fetchShoutOut),
    planShoutOutSolution: isBuilder.dispatch(planShoutOutSolution),
    addShoutOutTravelOffer: isBuilder.dispatch(addShoutOutTravelOffer),
  }
}
