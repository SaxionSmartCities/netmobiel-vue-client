import axios from 'axios'
import config from '@/config/config'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { Profile, ProfileState } from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'
import { getters, mutations } from '@/store/profile-service'
import * as uiStore from '@/store/ui'
import { generateHeaders, getCreatedObjectIdFromResponse } from '@/utils/Utils'

type ActionContext = BareActionContext<ProfileState, RootState>

const { PROFILE_BASE_URL, IMAGES_BASE_URL, GRAVITEE_PROFILE_SERVICE_API_KEY } =
  config

function createAbsoluteImageUrl(imageName: string | null | undefined): string {
  return imageName ? `${IMAGES_BASE_URL}/${imageName}` : ''
}

function createProfile(
  context: ActionContext,
  payload: Profile
): Promise<void> {
  const URL = `${PROFILE_BASE_URL}/profiles`
  payload.fcmToken = context.state.deviceFcmToken
  return axios
    .post(URL, payload, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(function () {
      fetchProfile(context).catch(() => {})
      return Promise.resolve()
    })
    .catch(function (error) {
      // eslint-disable-next-line
      console.log(error)
      const status = error.response.status
      let errorMsg
      if (status === 422) {
        errorMsg = 'Ontbrekende data (email, voornaam of achternaam).'
      } else if (status === 451) {
        errorMsg = 'Ga akkoord  met de gevraagde voorwaarden.'
      } else if (status === 409) {
        errorMsg = 'U bent al geregistreerd bij Netmobiel.'
      } else {
        errorMsg = error.response.data.message || error.response.data
      }
      uiStore.actions.queueErrorNotification(errorMsg)
      return Promise.reject(status)
    })
}

function fetchProfile(context: ActionContext) {
  const delegatorId = context.state.user.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY, delegatorId),
    })
    .then((response) => {
      if (response.status == 200 && response.data.profiles.length > 0) {
        const profile = {
          ...context.state.user.profile,
          ...response.data.profiles[0],
          image: createAbsoluteImageUrl(response.data.profiles[0].image),
        }
        mutations.setProfile(profile)
      }
      return Promise.resolve(response.status)
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      return Promise.reject(error.response.status)
    })
}

function fetchPublicProfile(context: ActionContext, { profileId }: any) {
  if (!profileId) {
    return Promise.reject('Specify a profile id')
  }
  const usr = getters.getPublicUsers.get(profileId)
  if (usr && usr.profile.id) {
    return Promise.resolve(usr.profile)
  }
  // Add public flag to assure the public profile is fetched, even when elevated privileges apply
  const URL = `${PROFILE_BASE_URL}/profiles/${profileId}?public=true`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then((response) => {
      if (response.data.profiles.length > 0) {
        const profile = {
          ...response.data.profiles[0],
          image: createAbsoluteImageUrl(response.data.profiles[0].image),
        }
        mutations.addPublicProfile(profile)
        return profile
      }
      return undefined
    })
    .catch((error) => {
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
    .then((response) => {
      if (response.status == 200) {
        const results = response.data.data.map((r: any) => {
          return {
            ...r,
            image: createAbsoluteImageUrl(r.image),
          }
        })
        mutations.setSearchResults(results)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
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
    .then((response) => {
      if (response.status == 200) {
        mutations.setFavoriteLocations(response.data.data)
      }
    })
    .catch((error) => {
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
    .then((response) => {
      fetchFavoriteLocations(context)
      if (response.status === 201) {
        uiStore.actions.queueInfoNotification(`Je favoriet is opgeslagen!`)
      }
    })
    .catch((error) => {
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
    .then((response) => {
      fetchFavoriteLocations(context)
      uiStore.actions.queueInfoNotification(`Favoriet verwijderd`)
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        `Fout bij het verwijderen van favoriet`
      )
    })
}

function storeSearchPreferences(context: ActionContext, payload: any) {
  // Convert payload to a profile object.
  const profile = {
    ...context.state.user.profile,
    searchPreferences: { ...payload },
  }
  return updateProfile(context, profile)
}

function storeRidePreferences(context: ActionContext, payload: any) {
  // Convert payload to a profile object.
  const profile = {
    ...context.state.user.profile,
    ridePlanOptions: { ...payload },
  }
  return updateProfile(context, profile)
}

function storeFcmToken(context: ActionContext) {
  const profile = { ...context.state.user.profile }
  if (context.state.deviceFcmToken !== profile.fcmToken) {
    profile.fcmToken = context.state.deviceFcmToken
    return updateProfile(context, profile)
  } else {
    return Promise.resolve()
  }
}

function updateProfile(context: ActionContext, profile: Profile) {
  const URL = `${PROFILE_BASE_URL}/profiles/${profile.id}`
  return axios
    .put(URL, profile, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then((response) => {
      if (response.status == 200 && response.data.profiles.length > 0) {
        const profile = {
          ...context.state.user.profile,
          ...response.data.profiles[0],
          image: createAbsoluteImageUrl(response.data.profiles[0].image),
        }
        mutations.setProfile(profile)
      }
    })
    .catch((error) => {
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
    .then((response) => {
      if (response.status === 200) {
        const imgSrc = `${IMAGES_BASE_URL}/${response.data.profiles[0].image}`
        mutations.setProfileImage(imgSrc)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
    })
}

/**
 * @param context: calling context
 * @param receiverId: the managed identity of the user receiving the compliments
 * @returns {Array<Object>} returns Array of compliments in the response.data
 */
function fetchUserCompliments(context: ActionContext, { receiverId }: any) {
  const usr = getters.getPublicUsers.get(receiverId)
  if (usr && usr.compliments.length > 0) {
    return Promise.resolve(usr.compliments)
  }
  const URL = `${PROFILE_BASE_URL}/compliments`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      params: { receiverId: receiverId },
    })
    .then((response) => {
      // @ts-ignore
      mutations.addPublicCompliments({
        profileId: receiverId,
        compliments: response.data.compliments,
      })
      return response.data.compliments
    })
    .catch((error) => {
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
    .then((response) => {
      mutations.setComplimentTypes(response.data.complimentTypes)
    })
}

/**
 * Adds a compliment to the user in the profile-service
 * @param actionContext
 * @param receiver: {id} the profile id of the receiver.
 * @param context: the context of the compliment
 * @param compliments: enum [ SAME_INTERESTS, ON_TIME, TALKS_EASILY, SOCIABLE, NEATLY, NICE_CAR ]
 * @returns {Object} Returns the compliment object in the response.data
 */
function addUserCompliments(
  actionContext: ActionContext,
  { receiver, context, compliments }: any
) {
  const URL = `${PROFILE_BASE_URL}/compliments`
  axios
    .post(
      URL,
      { receiver, context, compliments },
      {
        headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      }
    )
    .then((response) => {
      mutations.clearPublicCompliments(receiver.id)
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        `Fout bij versturen van complimenten`
      )
    })
}

/**
 * Removes a review of a user in the profile-service
 * @param actionContext: the calling context
 * @param receiverId: the id of the receiver
 * @param id: the id of the review
 * @returns {Object} Returns the review object in the response.data
 */
function removeUserCompliments(
  actionContext: ActionContext,
  { receiverId, complimentId }: any
) {
  const URL = `${PROFILE_BASE_URL}/compliments/${complimentId}`
  axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then((response) => {
      // Also no message when saving...
      // uiStore.actions.queueInfoNotification(`Je complimenten zijn verwijderd!`)
      mutations.clearPublicCompliments(receiverId)
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        `Fout bij verwijderen van complimenten`
      )
    })
}

/**
 * Fetches the reviews of a user based on the profileId
 * @param context: the calling context.
 * @param receiverId: the managed identity of the user receiving the compliments
 * @returns {Array<Object>} Returns an Array of reviews in the response.data.reviews
 */
function fetchUserReviews(context: ActionContext, { receiverId }: any) {
  const usr = getters.getPublicUsers.get(receiverId)
  if (usr && usr.reviews.length > 0) {
    return Promise.resolve(usr.reviews)
  }
  const URL = `${PROFILE_BASE_URL}/reviews`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      params: { receiverId: receiverId },
    })
    .then((response) => {
      // @ts-ignore
      mutations.addPublicReviews({
        profileId: receiverId,
        reviews: response.data.reviews,
      })
      return response.data.reviews
    })
}

/**
 * Adds a review to the user in the profile-service
 * @param actionContext: the calling context
 * @param receiver: {id}
 * @param context: context of the review
 * @param review the review to add
 * @returns {Object} Returns the review object in the response.data
 */
function addUserReview(
  actionContext: ActionContext,
  { receiver, context, review }: any
) {
  const URL = `${PROFILE_BASE_URL}/reviews`
  axios
    .post(
      URL,
      { receiver, context, review },
      {
        headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
      }
    )
    .then((response) => {
      mutations.clearPublicReviews(receiver.id)
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(`Fout bij opslaan van beoordeling`)
    })
}

/**
 * Removes a review of a user in the profile-service
 * @param actionContext: the calling context
 * @param receiverId: the id of the receiver
 * @param id: the id of the review
 * @returns {Object} Returns the review object in the response.data
 */
function removeUserReview(
  actionContext: ActionContext,
  { receiverId, reviewId }: any
) {
  const URL = `${PROFILE_BASE_URL}/reviews/${reviewId}`
  axios
    .delete(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then((response) => {
      uiStore.actions.queueInfoNotification(`Je beoordeling is verwijderd!`)
      mutations.clearPublicReviews(receiverId)
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        `Fout bij verwijderen van beoordeling`
      )
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
    .then((response) => {
      if (response.status === 201) {
        uiStore.actions.queueInfoNotification(`Je machtiging is opgeslagen!`)
        mutations.setSearchStatus('SUCCESS')
      } else {
        mutations.setSearchStatus('FAILED')
      }
    })
    .catch((error) => {
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
    .then((response) => {
      if (response.status === 204) {
        uiStore.actions.queueInfoNotification(`Je machtiging is verwijderd!`)
        fetchDelegations(context, { delegateId })
      }
    })
    .catch((error) => {
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
    .then((response) => {
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
    .catch((error) => {
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

// ==========  SURVEY  =============
/**
 * Attempt to create an active survey. The backend will take care to issue at most one
 * active survey. The method needs to called now and then (once in a session is
 * often enough). On a 201 the actual object must be fetched. On a 204 there is
 * no active survey.
 * @param context
 */
function createSurveyInvitation(context: ActionContext) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions`
  return axios
    .post(URL, null, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY, delegatorId),
    })
    .then((response) => {
      if (response.status === 201) {
        const id = getCreatedObjectIdFromResponse(response)
        return fetchSurvey(context, id)
      } else {
        return Promise.resolve()
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function fetchSurvey(context: ActionContext, id: string) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions/${id}`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY, delegatorId),
    })
    .then((response) => {
      if (response.status === 200) {
        mutations.setSurveyInteraction(response.data)
      } else {
        mutations.setSurveyInteraction(null)
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function fetchSurveyByProviderId(
  context: ActionContext,
  surveyProviderId: string
) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions?surveyId=${surveyProviderId}`
  return axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY, delegatorId),
    })
    .then((response) => {
      if (response.status === 200 && response.data.count >= 1) {
        return response.data.data[0]
      } else {
        return null
      }
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function markSurveyRedirection(context: ActionContext, surveyId: string) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions/${surveyId}/on-redirect`
  return axios
    .put(URL, null, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY, delegatorId),
    })
    .then((response) => {
      // Should be 204
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
    })
}

function markSurveySubmitted(context: ActionContext, surveyId: string) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions/${surveyId}/on-submit`
  return axios
    .put(URL, null, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY, delegatorId),
    })
    .then((response) => {
      // Should be 204
    })
    .catch((error) => {
      // eslint-disable-next-line
      console.log(error)
    })
}

export const buildActions = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  return {
    createProfile: psBuilder.dispatch(createProfile),
    fetchProfile: psBuilder.dispatch(fetchProfile),
    fetchPublicProfile: psBuilder.dispatch(fetchPublicProfile),
    fetchProfiles: psBuilder.dispatch(fetchProfiles),

    storeSearchPreferences: psBuilder.dispatch(storeSearchPreferences),
    storeRidePreferences: psBuilder.dispatch(storeRidePreferences),
    storeFcmToken: psBuilder.dispatch(storeFcmToken),
    updateProfile: psBuilder.dispatch(updateProfile),
    updateProfileImage: psBuilder.dispatch(updateProfileImage),

    fetchFavoriteLocations: psBuilder.dispatch(fetchFavoriteLocations),
    storeFavoriteLocation: psBuilder.dispatch(storeFavoriteLocation),
    deleteFavoriteLocation: psBuilder.dispatch(deleteFavoriteLocation),

    fetchComplimentTypes: psBuilder.dispatch(fetchComplimentTypes),
    fetchUserCompliments: psBuilder.dispatch(fetchUserCompliments),
    addUserCompliments: psBuilder.dispatch(addUserCompliments),
    removeUserCompliments: psBuilder.dispatch(removeUserCompliments),

    fetchUserReviews: psBuilder.dispatch(fetchUserReviews),
    addUserReview: psBuilder.dispatch(addUserReview),
    removeUserReview: psBuilder.dispatch(removeUserReview),

    fetchDelegations: psBuilder.dispatch(fetchDelegations),
    storeDelegation: psBuilder.dispatch(storeDelegation),
    deleteDelegation: psBuilder.dispatch(deleteDelegation),
    switchProfile: psBuilder.dispatch(switchProfile),

    createSurveyInvitation: psBuilder.dispatch(createSurveyInvitation),
    fetchSurvey: psBuilder.dispatch(fetchSurvey),
    markSurveyRedirection: psBuilder.dispatch(markSurveyRedirection),
    markSurveySubmitted: psBuilder.dispatch(markSurveySubmitted),
  }
}
