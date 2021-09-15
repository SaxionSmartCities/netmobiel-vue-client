import axios from 'axios'
import config from '@/config/config'
import util from '@/utils/Utils'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { Profile, ProfileState } from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'
import { getters, mutations } from '@/store/profile-service'
import * as uiStore from '@/store/ui'
import store from '..'
import { LocalDate } from '@js-joda/core'
import { addInterceptors } from '@/store/api-middelware'

type ActionContext = BareActionContext<ProfileState, RootState>

const {
  PROFILE_BASE_URL,
  IMAGES_BASE_URL,
  GRAVITEE_PROFILE_SERVICE_API_KEY,
} = config

const { generateHeaders } = util

function fetchProfile(context: ActionContext) {
  const delegatorId = context.state.user.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me`
  let axiosInstance = axios.create()
  addInterceptors(axiosInstance)
  axiosInstance
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY, delegatorId),
    })
    .then(response => {
      if (response.status == 200 && response.data.profiles.length > 0) {
        let profile = {
          ...context.state.user.profile,
          ...response.data.profiles[0],
          dateOfBirth: response.data.profiles[0].dateOfBirth
            ? LocalDate.parse(response.data.profiles[0].dateOfBirth)
            : null,
          image: response.data.profiles[0].image
            ? `${IMAGES_BASE_URL}/${response.data.profiles[0].image}`
            : '',
        }
        if (!!localStorage.fcm && localStorage.fcm !== profile.fcmToken) {
          profile.fcmToken = localStorage.fcm
          updateProfile(context, profile)
        } else {
          mutations.setProfile(profile)
        }
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function fetchPublicProfile(context: ActionContext, { profileId }: any) {
  if (!profileId) {
    return Promise.reject('Specify a profile id')
  }
  let usr = getters.getPublicUsers.get(profileId)
  if (usr && usr.profile.id) {
    return Promise.resolve(usr.profile)
  }
  // Add public flag to assure the public profile is fetched, even when elevated privileges apply
  const URL = `${PROFILE_BASE_URL}/profiles/${profileId}?public=true`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.data.profiles.length > 0) {
        let profile = {
          ...response.data.profiles[0],
          image: response.data.profiles[0].image
            ? `${IMAGES_BASE_URL}/${response.data.profiles[0].image}`
            : '',
        }
        mutations.addPublicProfile(profile)
        return profile
      }
      return undefined
    })
    .catch(error => {
      // eslint-disable-next-line
      console.warn(`Error fetching public profile - ${error.response.status} ${error.response.statusText}: ${error.response.data?.message}`)
      // Don't trouble the user with public profile that seem absent ot so
      // uiStore.actions.queueInfoNotification(
      //   `Fout bij het ophalen van het profiel`
      // )
      return undefined
    })
}

function fetchProfiles(context: ActionContext, { keyword }: any) {
  const URL = `${PROFILE_BASE_URL}/profiles?text=${keyword}`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status == 200) {
        const results = response.data.data.map((r: any) => {
          return {
            ...r,
            image: r.image ? `${IMAGES_BASE_URL}/${r.image}` : '',
          }
        })
        mutations.setSearchResults(results)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

/**
 * @param profileId: the user his managed Identity (keycloak)
 * @returns {Array<Object>} returns Array of compliments in the response.data
 */
function fetchUserCompliments(context: ActionContext, { profileId }: any) {
  let usr = getters.getPublicUsers.get(profileId)
  if (usr && usr.compliments) {
    return Promise.resolve(usr.compliments)
  }
  const URL = `${PROFILE_BASE_URL}/compliments`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      params: { receiverId: profileId },
    })
    .then(response => {
      // @ts-ignore
      mutations.addPublicCompliments({
        profileId,
        compliments: response.data.compliments,
      })
      return response.data.compliments
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueInfoNotification(
        `Fout bij het ophalen van de complimenten`
      )
    })
}

/**
 * Fetches the available compliments and sets the compliment types
 * that are available in the store
 */
function fetchComplimentTypes(context: ActionContext) {
  const URL = `${PROFILE_BASE_URL}/compliments/types`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      mutations.setComplimentTypes(response.data.complimentTypes)
    })
}

/**
 * Adds a compliment to the user in the profile-service
 * @param context
 * @param sender: {id, firstName, lastName}
 * @param receiver: {id, firstName, lastName}
 * @param complimentType: enum [
 'Zelfde interesses',
 'Op tijd',
 'Soepele communicatie',
 'Gezellig',
 'Netjes',
 'Goede auto',
 ]
 * @returns {Object} Returns the compliment object in the response.data
 */
function addUserCompliment(
  context: ActionContext,
  { sender, receiver, complimentType }: any
) {
  const URL = `${PROFILE_BASE_URL}/compliments`
  axios
    .post(
      URL,
      { sender, receiver, complimentType },
      {
        headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      }
    )
    .then(response => {
      mutations.clearPublicCompliments(receiver.id)
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        `Fout bij versturen van complimenten`
      )
    })
}

/**
 * Fetches the reviews of a user based on the profileId
 * @returns {Array<Object>} Returns an Array of reviews in the response.data.reviews
 */
function fetchUserReviews(context: ActionContext, { profileId }: any) {
  let usr = getters.getPublicUsers.get(profileId)
  if (usr && usr.reviews) {
    return Promise.resolve(usr.reviews)
  }
  const URL = `${PROFILE_BASE_URL}/reviews`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      params: { receiverId: profileId },
    })
    .then(response => {
      // @ts-ignore
      mutations.addPublicReviews({
        profileId,
        reviews: response.data.reviews,
      })
      return response.data.reviews
    })
}

/**
 * Adds a review to the user in the profile-service
 * @param sender: {id, firstName, lastName}
 * @param receiver: {id, firstName, lastName}
 * @returns {Object} Returns the review object in the response.data
 */
function addUserReview(
  context: ActionContext,
  { sender, receiver, review }: any
) {
  const URL = `${PROFILE_BASE_URL}/reviews`
  axios
    .post(
      URL,
      { sender, receiver, review },
      {
        headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      }
    )
    .then(response => {
      if (response.status === 201) {
        uiStore.actions.queueInfoNotification(`Je beoordeling is opgeslagen!`)
        mutations.clearPublicReviews(receiver.id)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(`Fout bij opslaan van beoordeling`)
    })
}

function fetchFavoriteLocations(context: ActionContext) {
  const delegatorId = context.state.user.delegatorId
  const profileId = context.state.user.profile.id
  const URL = `${PROFILE_BASE_URL}/profiles/${profileId}/places`
  if (profileId === null) {
    return
  }
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY, delegatorId),
    })
    .then(response => {
      if (response.status == 200) {
        mutations.setFavoriteLocations(response.data.data)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        `Fout bij ophalen van de favorieten`
      )
    })
}

function storeFavoriteLocation(
  context: ActionContext,
  { profileId, place }: any
) {
  const URL = `${PROFILE_BASE_URL}/profiles/${profileId}/places`
  return axios
    .post(URL, place, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      fetchFavoriteLocations(context)
      if (response.status === 201) {
        uiStore.actions.queueInfoNotification(`Je favoriet is opgeslagen!`)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(`Fout bij opslaan van favorieten`)
    })
}

function deleteFavoriteLocation(
  context: ActionContext,
  { profileId, placeId }: any
) {
  const URL = `${PROFILE_BASE_URL}/profiles/${profileId}/places/${placeId}`
  return axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      fetchFavoriteLocations(context)
      uiStore.actions.queueInfoNotification(`Favoriet verwijderd`)
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        `Fout bij het verwijderen van favoriet`
      )
    })
}

function storeSearchPreferences(context: ActionContext, payload: any) {
  // Convert payload to a profile object.
  let profile = {
    ...context.state.user.profile,
    searchPreferences: { ...payload },
  }
  updateProfile(context, profile)
}

function storeRidePreferences(context: ActionContext, payload: any) {
  // Convert payload to a profile object.
  let profile = {
    ...context.state.user.profile,
    ridePlanOptions: { ...payload },
  }
  updateProfile(context, profile)
}

function storeFcmToken(context: ActionContext, payload: { fcmToken: string }) {
  let profile = { ...context.state.user.profile }
  profile.fcmToken = payload.fcmToken
  updateProfile(context, profile)
}

function updateProfile(context: ActionContext, profile: Profile) {
  const URL = `${PROFILE_BASE_URL}/profiles/${profile.id}`
  axios
    .put(URL, profile, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status == 200 && response.data.profiles.length > 0) {
        let profile = {
          ...context.state.user.profile,
          ...response.data.profiles[0],
        }
        const imgSrc = `${IMAGES_BASE_URL}/${response.data.profiles[0].image}`
        profile.image = imgSrc
        mutations.setProfile(profile)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function updateProfileImage(context: ActionContext, { id, image }: any) {
  const URL = `${PROFILE_BASE_URL}/profiles/${id}/image`
  axios
    .put(
      URL,
      { image },
      {
        headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      }
    )
    .then(response => {
      if (response.status === 200) {
        const imgSrc = `${IMAGES_BASE_URL}/${response.data.profiles[0].image}`
        mutations.setProfileImage(imgSrc)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function fetchDelegation(context: ActionContext, { delegationId }: any) {
  const URL = `${PROFILE_BASE_URL}/delegations/${delegationId}`
  // TODO: Implement logic.
}

function storeDelegation(
  context: ActionContext,
  { delegateId, delegatorId }: any
) {
  const URL = `${PROFILE_BASE_URL}/delegations`
  mutations.setSearchStatus('PENDING')
  axios
    .post(
      URL,
      { delegateRef: delegateId, delegatorRef: delegatorId },
      {
        headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      }
    )
    .then(response => {
      if (response.status === 201) {
        uiStore.actions.queueInfoNotification(`Je machtiging is opgeslagen!`)
        mutations.setSearchStatus('SUCCESS')
      } else {
        mutations.setSearchStatus('FAILED')
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        `Fout bij opslaan van de machtiging`
      )
      mutations.setSearchStatus('FAILED')
    })
}

function deleteDelegation(
  context: ActionContext,
  { delegateId, delegationId }: any
) {
  const URL = `${PROFILE_BASE_URL}/delegations/${delegationId}`
  return axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status === 204) {
        uiStore.actions.queueInfoNotification(`Je machtiging is verwijderd!`)
        fetchDelegations(context, { delegateId })
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueInfoNotification(
        `Fout bij het verwijderen van de machtiging`
      )
    })
}

function fetchDelegations(context: ActionContext, { delegateId }: any) {
  const URL = `${PROFILE_BASE_URL}/delegations?delegate=${delegateId}`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      // Turn relative image URLs into absolute URLs.
      response.data.data.map((d: any) => {
        if (d.delegate?.image) {
          d.delegate.image = `${IMAGES_BASE_URL}/${d.delegate.image}`
        }
        if (d.delegator?.image) {
          d.delegator.image = `${IMAGES_BASE_URL}/${d.delegator.image}`
        }
      })
      // HACK: Add a delegation for your own account so that you are shown
      // in the user list in the delegation overview page.
      let profile = context.state.user.delegateProfile
      if (!profile) {
        profile = context.state.user.profile
      }
      const own_delegation = { id: -1, delegate: profile, delegator: profile }
      response.data.data.splice(0, 0, own_delegation)
      mutations.setDelegations(response.data.data)
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueInfoNotification(
        `Fout bij het ophalen van de machtigingen`
      )
    })
}

function switchProfile(context: ActionContext, { delegatorId }: any) {
  // Is we don't have a delegate profile stored yet we will assume the
  // current user profile is the delegate.
  if (context.state.user.delegateProfile == null) {
    const profile = { ...context.state.user.profile }
    mutations.setDelegateProfile(profile)
  }
  mutations.setDelegatorId(delegatorId)
  fetchProfile(context)
}

export const buildActions = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  return {
    fetchProfile: psBuilder.dispatch(fetchProfile),
    fetchPublicProfile: psBuilder.dispatch(fetchPublicProfile),
    fetchProfiles: psBuilder.dispatch(fetchProfiles),
    fetchUserCompliments: psBuilder.dispatch(fetchUserCompliments),
    fetchComplimentTypes: psBuilder.dispatch(fetchComplimentTypes),
    addUserCompliment: psBuilder.dispatch(addUserCompliment),
    fetchUserReviews: psBuilder.dispatch(fetchUserReviews),
    addUserReview: psBuilder.dispatch(addUserReview),
    fetchFavoriteLocations: psBuilder.dispatch(fetchFavoriteLocations),
    storeFavoriteLocation: psBuilder.dispatch(storeFavoriteLocation),
    deleteFavoriteLocation: psBuilder.dispatch(deleteFavoriteLocation),
    storeSearchPreferences: psBuilder.dispatch(storeSearchPreferences),
    storeRidePreferences: psBuilder.dispatch(storeRidePreferences),
    storeFcmToken: psBuilder.dispatch(storeFcmToken),
    updateProfile: psBuilder.dispatch(updateProfile),
    updateProfileImage: psBuilder.dispatch(updateProfileImage),
    fetchDelegations: psBuilder.dispatch(fetchDelegations),
    storeDelegation: psBuilder.dispatch(storeDelegation),
    deleteDelegation: psBuilder.dispatch(deleteDelegation),
    switchProfile: psBuilder.dispatch(switchProfile),
  }
}
