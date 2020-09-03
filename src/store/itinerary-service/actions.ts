import axios from 'axios'
import moment from 'moment'
import config from '@/config/config'
import constants from '../../constants/constants'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { ItineraryState, TripSelection } from '@/store/itinerary-service/types'
import { RootState } from '../Rootstate'
import { mutations } from '@/store/itinerary-service/index'
import * as uiStore from '@/store/ui'
type ActionContext = BareActionContext<ItineraryState, RootState>

const BASE_URL = config.BASE_URL
const GRAVITEE_PLANNER_SERVICE_API_KEY = config.GRAVITEE_PLANNER_SERVICE_API_KEY

function generateHeader(key: any) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

function submitPlanningsRequest(
  context: ActionContext,
  { from, to, travelTime, preferences }: any
) {
  mutations.storePlanningRequest({
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
  mutations.setPlanningStatus({ status: 'PENDING', message: '' })
  axios
    .get(URL, {
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
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
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status === 204) {
        //Succesful response, trip is deleted.
        uiStore.actions.queueInfoNotification('Reis is succesvol geannuleerd')
        fetchTrips(context, {
          maxResults: constants.fetchTripsMaxResults,
          offset: 0,
        })
      } else if (response.status === 404) {
        //requested trip could not be found
        uiStore.actions.queueErrorNotification(
          'De opgegeven reis kon niet worden gevonden.'
        )
      } else if (response.status === 401) {
        //The requested object does no longer exist
        uiStore.actions.queueErrorNotification('Deze reis is al geannuleerd')
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het annuleren van de reis'
      )
    })
}

function storeSelectedTrip(context: ActionContext, payload: TripSelection) {
  const URL = BASE_URL + '/planner/trips'
  axios
    .post(URL, payload, {
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status == 201) {
        let message = 'Uw reis is bevestigd!'
        uiStore.actions.queueInfoNotification(message)
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het opslaan van de reis.'
      )
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
  axios
    .post(URL, payload, {
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status == 201) {
        let message = 'Oproep naar de community is geplaatst'
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

function storeTravelOffer(
  context: ActionContext,
  { shoutoutPlanId, planRef, vehicleRef, driverRef }: any
) {
  let payload = { planRef, vehicleRef, driverRef }
  const URL = `${BASE_URL}/planner/shout-outs/${shoutoutPlanId}`
  axios
    .post(URL, payload, {
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
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
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
      params: params,
    })
    .then(response => {
      if (response.status === 200 && response.data.data.length > 0) {
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
        'Fout bij het ophalen van opgeslagen reizen.'
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
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
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
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
      params: params,
    })
    .then(response => {
      if (response.status === 200) {
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
    .get(URL, { headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY) })
    .then(response => {
      if (response.status == 200) {
        mutations.setSelectedTrip(response.data)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de reis.'
      )
    })
}

function fetchTrip(context: ActionContext, payload: any) {
  const tripId = payload.id
  const URL = `${BASE_URL}/planner/trips/${tripId}`
  return axios
    .get(URL, { headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY) })
    .then(response => {
      if (response.status == 200) {
        mutations.setSelectedTrip(response.data)
      }
      return response.data
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de reis.'
      )
    })
}

function submitShoutOutPlanningsRequest(context: ActionContext, payload: any) {
  const { id, from, travelTime } = payload
  const URL = `${BASE_URL}/planner/shout-outs/${id}/plan`
  const params: any = {
    from: `${from.label}::${from.latitude},${from.longitude}`,
  }
  if (travelTime) {
    params.travelTime = travelTime.when.format()
    params.useAsArrivalTime = travelTime.arriving
  }
  mutations.storePlanningRequest({ from, travelTime })
  mutations.setPlanningStatus({ status: 'PENDING' })
  axios
    .get(URL, {
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
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
      headers: generateHeader(GRAVITEE_PLANNER_SERVICE_API_KEY),
      params: params,
    })
    .then(response => {
      mutations.setCancelledTrips(response.data.data)
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van geannuleerde reizen.'
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
    storeTravelOffer: isBuilder.dispatch(storeTravelOffer),
    fetchTrips: isBuilder.dispatch(fetchTrips),
    fetchCancelledTrips: isBuilder.dispatch(fetchCancelledTrips),
    fetchShoutOuts: isBuilder.dispatch(fetchShoutOuts),
    fetchMyShoutOuts: isBuilder.dispatch(fetchMyShoutOuts),
    fetchShoutOut: isBuilder.dispatch(fetchShoutOut),
    fetchTrip: isBuilder.dispatch(fetchTrip),
    submitShoutOutPlanningsRequest: isBuilder.dispatch(
      submitShoutOutPlanningsRequest
    ),
  }
}
