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

const { BASE_URL, GRAVITEE_PLANNER_SERVICE_API_KEY } = config
const { generateHeaders } = util

function submitPlanningsRequest(
  context: ActionContext,
  searchCiteria: SearchCriteria
) {
  mutations.storePlanningRequest(searchCiteria)
  const URL = BASE_URL + '/planner/search/plan'
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
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
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

function deleteSelectedTrip(context: ActionContext, payload: any) {
  const URL = BASE_URL + `/planner/trips/${payload.tripId}`
  axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
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

function storeSelectedTrip(context: ActionContext, payload: TripSelection) {
  mutations.setBookingStatus({ status: 'PENDING' })
  const URL = BASE_URL + '/planner/trips'
  axios
    .post(URL, payload, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
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

function storeShoutOut(
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
  const URL = BASE_URL + '/planner/plans'
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

function deleteShoutOut(context: ActionContext, { shoutoutPlanId }: any) {
  const URL = `${BASE_URL}/planner/shout-outs/${shoutoutPlanId}`
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
function storeTravelOffer(
  context: ActionContext,
  { shoutoutPlanId, planRef, vehicleRef, driverRef }: any
) {
  let payload = { planRef, vehicleRef, driverRef }
  const URL = `${BASE_URL}/planner/shout-outs/${shoutoutPlanId}`
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

  const URL = `${BASE_URL}/planner/trips`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
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
    .get(BASE_URL + '/planner/shout-outs', {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
      params: params,
    })
    .then(response => {
      if (response.status === 200) {
        mutations.setShoutOutsTotalCount(response.data.totalCount)
        response.data.data.length > 0 &&
          mutations.setShoutOuts(response.data.data)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function fetchMyShoutOuts(context: ActionContext, { offset: offset }: any) {
  const params = {
    offset,
    inProgressOnly: true,
    planType: 'SHOUT_OUT',
    since: moment().format(),
  }
  axios
    .get(BASE_URL + '/planner/plans', {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
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

function fetchShoutOut(context: ActionContext, { id }: any) {
  const URL = `${BASE_URL}/planner/plans/${id}`
  axios
    .get(URL, { headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY) })
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

function fetchTrip(context: ActionContext, payload: any) {
  const tripId = payload.id
  const URL = `${BASE_URL}/planner/trips/${tripId}`
  return axios
    .get(URL, { headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY) })
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

function confirmTrip(context: ActionContext, payload: any) {
  const URL = `${BASE_URL}/planner/trips/${payload.id}/confirm/true`
  const data = {}
  const config = {
    headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
  }
  axios
    .put(URL, data, config)
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
      uiStore.actions.queueErrorNotification(
        'Fout bij het bevestigen van uw rit.'
      )
    })
}

function submitShoutOutPlanningsRequest(context: ActionContext, payload: any) {
  const { id, from, to = {}, travelTime } = payload
  const URL = `${BASE_URL}/planner/shout-outs/${id}/plan`
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

function fetchCancelledTrips(context: ActionContext) {
  const params: any = { state: 'CANCELLED' }
  const URL = `${BASE_URL}/planner/trips`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
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

export const buildActions = (
  isBuilder: ModuleBuilder<ItineraryState, RootState>
) => {
  return {
    submitPlanningsRequest: isBuilder.dispatch(submitPlanningsRequest),
    deleteSelectedTrip: isBuilder.dispatch(deleteSelectedTrip),
    storeSelectedTrip: isBuilder.dispatch(storeSelectedTrip),
    storeShoutOut: isBuilder.dispatch(storeShoutOut),
    deleteShoutOut: isBuilder.dispatch(deleteShoutOut),
    storeTravelOffer: isBuilder.dispatch(storeTravelOffer),
    fetchTrips: isBuilder.dispatch(fetchTrips),
    fetchCancelledTrips: isBuilder.dispatch(fetchCancelledTrips),
    fetchShoutOuts: isBuilder.dispatch(fetchShoutOuts),
    fetchMyShoutOuts: isBuilder.dispatch(fetchMyShoutOuts),
    fetchShoutOut: isBuilder.dispatch(fetchShoutOut),
    fetchTrip: isBuilder.dispatch(fetchTrip),
    confirmTrip: isBuilder.dispatch(confirmTrip),
    submitShoutOutPlanningsRequest: isBuilder.dispatch(
      submitShoutOutPlanningsRequest
    ),
  }
}
