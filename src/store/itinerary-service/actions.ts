import axios, { AxiosRequestHeaders } from 'axios'
import moment from 'moment'
import config from '@/config/config'
import constants from '../../constants/constants'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { RootState } from '../Rootstate'
import { mutations } from '@/store/itinerary-service/index'
import {
  Itinerary,
  ItineraryState,
  SearchCriteria,
  ShoutOutSearchCriteria,
} from '@/store/itinerary-service/types'
import * as uiStore from '@/store/ui'
import { generateHeaders, getCreatedObjectIdFromResponse } from '@/utils/Utils'

type ActionContext = BareActionContext<ItineraryState, RootState>

const { PLANNER_BASE_URL, GRAVITEE_PLANNER_SERVICE_API_KEY } = config

// ============  TRIP PLAN MANAGEMENT  ================
// Creates a regular TripPlan on success

function searchTripPlan(
  context: ActionContext,
  searchCriteria: SearchCriteria
) {
  mutations.setPlanningSearchCriteria(searchCriteria)
  const URL = `${PLANNER_BASE_URL}/search/plan`
  const { from, to, travelTime, preferences } = searchCriteria
  if (!from) {
    throw new Error('from is mandatory')
  }
  if (!to) {
    throw new Error('to is mandatory')
  }
  if (!travelTime || !travelTime.when) {
    throw new Error('travelTime is mandatory')
  }
  if (!preferences) {
    throw new Error('preferences is mandatory')
  }
  const params = {
    from: `${from.label}::${from.latitude},${from.longitude}`,
    to: `${to.label}::${to.latitude},${to.longitude}`,
    nrSeats: preferences.numPassengers,
    modalities: preferences.allowedTravelModes.toString(),
    maxWalkDistance: preferences.maxWalkDistance,
    firstLegRideshare: preferences.allowFirstLegRideshare || false,
    lastLegRideshare: preferences.allowLastLegRideshare || false,
    travelTime: travelTime.when.format(),
    useAsArrivalTime: travelTime.arriving,
  }
  mutations.setPlanningStatus({ status: 'PENDING', message: '' })
  const delegatorId = context.rootState.ps.user.delegatorId
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then((response) => {
      mutations.setPlanningResults(response.data)
      mutations.setPlanningStatus({ status: 'SUCCESS' })
    })
    .catch((error) => {
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
  const delegatorId = context.rootState.ps.user.delegatorId
  const payload = {
    from,
    to,
    nrSeats: preferences.numPassengers,
    modalities: preferences.allowedTravelModes,
    maxWalkDistance: preferences.maxWalkDistance,
    firstLegRideshare: preferences.allowFirstLegRideshare || false,
    lastLegRideshare: preferences.allowLastLegRideshare || false,
    travelTime: travelTime.when.format(),
    useAsArrivalTime: travelTime.arriving,
    planType: 'SHOUT_OUT',
  }
  const URL = `${PLANNER_BASE_URL}/plans`
  return axios
    .post(URL, payload, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      let shoutOutId
      if (response.status == 201) {
        const message = 'Oproep naar de community is geplaatst'
        uiStore.actions.queueInfoNotification(message)
        shoutOutId = getCreatedObjectIdFromResponse(response)
      } else {
        const message = response.data.message
        uiStore.actions.queueErrorNotification(message)
      }
      return shoutOutId
    })
    .catch((error) => {
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
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status == 200) {
        mutations.setSelectedTripPlan(response.data)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification('Fout bij het ophalen van de rit.')
    })
}

function fetchMyShoutOutTripPlans(
  context: ActionContext,
  { offset, maxResults }: any
) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const params = {
    offset: offset || 0,
    maxResults: maxResults,
    inProgressOnly: true, // Only shout-outs that are still running
    planType: 'SHOUT_OUT',
    since: moment().format(),
  }
  axios
    .get(`${PLANNER_BASE_URL}/plans`, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then((response) => {
      if (response.status === 200) {
        mutations.setMyShoutOutsTotalCount(response.data.totalCount)
        if (maxResults !== 0) {
          // When you using a offset you want to append the shoutouts and not clear the already fetched shoutouts.
          if (offset > 0) {
            mutations.appendMyShoutOuts(response.data.data)
          } else {
            mutations.setMyShoutOuts(response.data.data)
          }
        }
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
    })
}

// Cancel a (shout-out) trip plan. A regular plan cannot be cancelled because it is already closed.
function cancelTripPlan(
  context: ActionContext,
  { tripPlanId, cancelReason }: any
) {
  const URL = `${PLANNER_BASE_URL}/plans/${tripPlanId}`
  const params: any = {
    reason: cancelReason ? cancelReason : undefined,
  }
  const delegatorId = context.rootState.ps.user.delegatorId
  return axios
    .delete(URL, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params,
    })
    .then((response) => {
      if (response.status == 204) {
        uiStore.actions.queueInfoNotification('Je oproep is verwijderd')
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het verwijderen van uw oproep.'
      )
    })
}

// ============  TRIP MANAGEMENT  ================

/**
 * Creates a trip from a previously created itinerary reference.
 * @param context
 * @param itinerary the itinerary and itinerary reference from a planning request (regular or shout-out).
 */
function createTrip(context: ActionContext, itinerary: Itinerary) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const tripRequest = { itineraryRef: itinerary.itineraryRef }
  mutations.setBookingStatus({ status: 'PENDING' })
  const now = moment()
  if (moment(itinerary.departureTime).isBefore(now)) {
    uiStore.actions.queueErrorNotification(
      'De vertrektijd van deze rit is al verstreken'
    )
    return Promise.reject()
  }
  const URL = `${PLANNER_BASE_URL}/trips`
  return axios
    .post(URL, tripRequest, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status == 201) {
        const message = 'Uw rit is bevestigd!'
        uiStore.actions.queueInfoNotification(message)
        mutations.setBookingStatus({ status: 'SUCCESS' })
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
        mutations.setBookingStatus({ status: 'FAILED' })
      }
    })
    .catch((error) => {
      mutations.setBookingStatus({ status: 'FAILED' })
      // eslint-disable-next-line
      console.log(error)
      if (error.response.status == 402) {
        uiStore.actions.queueErrorNotification(
          'Je hebt onvoldoende credits voor deze rit'
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
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then((response) => {
      if (response.status === 200) {
        if (pastTrips) {
          offset === 0
            ? mutations.setPastTrips(response.data.data)
            : mutations.appendPastTrips(response.data.data)
          mutations.setPastTripsCount(response.data.totalCount)
        } else {
          offset === 0
            ? mutations.setPlannedTrips(response.data.data)
            : mutations.appendPlannedTrips(response.data.data)
          mutations.setPlannedTripsCount(response.data.totalCount)
        }
      }
    })
    .catch((error) => {
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
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then((response) => {
      mutations.setCancelledTrips(response.data.data)
    })
    .catch((error) => {
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
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status == 200) {
        mutations.setSelectedTrip(response.data)
      }
      return response.data
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification('Fout bij het ophalen van de rit.')
    })
}

function deleteTrip(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PLANNER_BASE_URL}/trips/${payload.tripId}`
  const params: any = {
    reason: payload.cancelReason ? payload.cancelReason : undefined,
  }
  return axios
    .delete(URL, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then((response) => {
      if (response.status === 204) {
        //Succesful response, trip is deleted.
        if (payload.displayWarning) {
          uiStore.actions.queueInfoNotification('Rit is succesvol geannuleerd')
        }
      } else if (response.status === 404) {
        //requested trip could not be found
        uiStore.actions.queueErrorNotification(
          'De opgegeven rit kon niet worden gevonden.'
        )
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het annuleren van de rit'
      )
    })
}

function confirmTrip(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PLANNER_BASE_URL}/trips/${payload.id}/confirm/true`
  const data = {}
  const config = {
    headers: generateHeaders(
      GRAVITEE_PLANNER_SERVICE_API_KEY,
      delegatorId
    ) as AxiosRequestHeaders,
  }
  return axios
    .put(URL, data, config)
    .then(function (resp) {
      if (resp.status == 204) {
        // Ride is confirmed
        uiStore.actions.queueInfoNotification('Uw rit is bevestigd.')
      }
    })
    .catch(function (error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het bevestigen van uw rit.'
      )
    })
}

function rejectTrip(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PLANNER_BASE_URL}/trips/${payload.id}/confirm/false?reason=${payload.reasonCode}`
  const data = {}
  const config = {
    headers: generateHeaders(
      GRAVITEE_PLANNER_SERVICE_API_KEY,
      delegatorId
    ) as AxiosRequestHeaders,
  }
  return axios
    .put(URL, data, config)
    .then((resp) => {
      if (resp.status == 204) {
        // Ride is confirmed
        uiStore.actions.queueInfoNotification('Je hebt je rit afgewezen.')
      }
    })
    .catch(function (error) {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het afwijzen van uw rit.'
      )
    })
}

function unconfirmTrip(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PLANNER_BASE_URL}/trips/${payload.id}/unconfirm`
  const config = {
    headers: generateHeaders(
      GRAVITEE_PLANNER_SERVICE_API_KEY,
      delegatorId
    ) as AxiosRequestHeaders,
  }
  return axios
    .put(URL, {}, config)
    .then(function (resp) {
      if (resp.status == 204) {
        // Ride is confirmed
        uiStore.actions.queueInfoNotification(
          'Je kunt je rit nu opnieuw bevestigen.'
        )
      }
    })
    .catch(function (error) {
      // eslint-disable-next-line
      console.log(error)
      if (error.response.status === 403) {
        uiStore.actions.queueErrorNotification(
          'De rit is reeds afgerekend. Vraag de chauffeur om de bevestiging ongedaan te maken.'
        )
      } else if (error.response.status == 402) {
        uiStore.actions.queueErrorNotification(
          'Je hebt onvoldoende credits om deze rit opnieuw te reserveren'
        )
      } else {
        uiStore.actions.queueErrorNotification(
          'Fout bij het ongedaan maken van de bevestiging van uw rit.'
        )
      }
    })
}
// ============  SHOUT-OUT MANAGEMENT  ================
// driver calls!

/**
 * Fetches a shout-out, A shout-out is the same as a trip plan, but the itineraries
 * are not visible for others than the owner.
 * @param context
 * @param id the trip plan to fetch (should be a shout-out)
 */
function fetchShoutOut(context: ActionContext, { id }: any) {
  const URL = `${PLANNER_BASE_URL}/shout-outs/${id}`
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status == 200) {
        mutations.setSelectedShoutOut(response.data)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de oproep.'
      )
    })
}

function fetchShoutOuts(
  context: ActionContext,
  { location, depArrRadius, travelRadius, maxResults }: any
) {
  let driverLocation = location
  let theDepArrRadius = depArrRadius
  let theTravelRadius = travelRadius
  if (!driverLocation) {
    driverLocation = constants.GEOLOCATION_CENTER_NL
    theDepArrRadius = constants.shoutOutDepArrRadiusWhole_NL
  }
  if (!theDepArrRadius) {
    theDepArrRadius = constants.shoutOutDepArrRadiusNearby
    theTravelRadius = constants.shoutOutTravelRadius
  }
  const params = {
    maxResults: maxResults,
    location: `${driverLocation.latitude},${driverLocation.longitude}`,
    depArrRadius: theDepArrRadius,
    travelRadius: theTravelRadius,
  }
  axios
    .get(`${PLANNER_BASE_URL}/shout-outs`, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then((response) => {
      if (response.status === 200) {
        mutations.setShoutOutsTotalCount(response.data.totalCount)
        mutations.setShoutOuts(response.data.data)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de oproepen'
      )
    })
}

function planShoutOutSolution(
  context: ActionContext,
  payload: ShoutOutSearchCriteria
) {
  const { shoutOutId, from, to, travelTime } = payload
  const URL = `${PLANNER_BASE_URL}/shout-outs/${shoutOutId}/plan`
  const params: any = {}
  if (from) {
    params.from = `${from.label}::${from.latitude},${from.longitude}`
  }
  if (to) {
    params.to = `${to.label}::${to.latitude},${to.longitude}`
  }
  if (travelTime) {
    params.travelTime = travelTime.when.format()
    params.useAsArrivalTime = travelTime.arriving
  }
  mutations.setPlanningSearchCriteria({ from, to, travelTime })
  mutations.setPlanningStatus({ status: 'PENDING' })
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: params,
    })
    .then((response) => {
      mutations.setPlanningStatus({ status: 'SUCCESS' })
      mutations.setPlanningResults(response.data)
    })
    .catch((error) => {
      mutations.setPlanningStatus({ status: 'FAILED' })
      uiStore.actions.queueErrorNotification(
        error.response ? error.response.data.message : 'Network failure'
      )
    })
}

function addShoutOutTravelOffer(
  context: ActionContext,
  { shoutOutPlanId, planRef, vehicleRef, driverRef }: any
) {
  const payload = { planRef, vehicleRef, driverRef }
  const URL = `${PLANNER_BASE_URL}/shout-outs/${shoutOutPlanId}`
  return axios
    .post(URL, payload, {
      headers: generateHeaders(
        GRAVITEE_PLANNER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status == 202) {
        const message =
          'Je aanbod is verstuurd en de passagier op de hoogte gebracht.'
        uiStore.actions.queueInfoNotification(message)
      } else {
        uiStore.actions.queueErrorNotification(response.data.message)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het opslaan van uw aanbod.'
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
    confirmTrip: isBuilder.dispatch(confirmTrip),
    rejectTrip: isBuilder.dispatch(rejectTrip),
    unconfirmTrip: isBuilder.dispatch(unconfirmTrip),

    // Shout-out handling for drivers
    fetchShoutOuts: isBuilder.dispatch(fetchShoutOuts),
    fetchShoutOut: isBuilder.dispatch(fetchShoutOut),
    planShoutOutSolution: isBuilder.dispatch(planShoutOutSolution),
    addShoutOutTravelOffer: isBuilder.dispatch(addShoutOutTravelOffer),
  }
}
