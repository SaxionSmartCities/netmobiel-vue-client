import axios, { AxiosError, AxiosRequestHeaders } from 'axios'
import config from '@/config/config'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import {
  Delegation,
  Profile,
  ProfileState,
  PublicProfile,
  User,
  UserSession,
} from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'
import { getters, mutations } from '@/store/profile-service'
import * as uiStore from '@/store/ui'
import { generateHeaders } from '@/utils/Utils'
import { Page } from '@/store/types'
import { emptyPage } from '@/store/storeHelper'
import moment from 'moment'
import Vue from 'vue'

type ActionContext = BareActionContext<ProfileState, RootState>

const { PROFILE_BASE_URL, IMAGES_BASE_URL, GRAVITEE_PROFILE_SERVICE_API_KEY } =
  config

function createAbsoluteImageUrl(imageName: string | null | undefined): string {
  return imageName ? `${IMAGES_BASE_URL}/${imageName}` : ''
}

function updateRealUser(context: ActionContext) {
  const kc: any = Vue.prototype.$keycloak
  // Update only if issues time has changed
  if (kc?.tokenParsed['iat'] !== getters.getRealUser?.issuedAt) {
    const user: User = {
      issuedAt: kc.tokenParsed['iat'],
      managedIdentity: kc.tokenParsed['sub'],
      givenName: kc.tokenParsed['given_name'],
      familyName: kc.tokenParsed['family_name'],
      email: kc.tokenParsed['email'],
      fullName: kc.tokenParsed['name'],
    }
    mutations.setUser(user)
  }
}

function createProfile(
  context: ActionContext,
  payload: Profile
): Promise<void> {
  const URL = `${PROFILE_BASE_URL}/profiles`
  return axios
    .post(URL, payload, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then(function () {
      return Promise.resolve()
    })
    .catch(function (error) {
      const status = error.response?.status
      let errorMsg
      if (status === 422) {
        errorMsg = 'Ontbrekende data (email, voornaam of achternaam).'
      } else if (status === 451) {
        errorMsg = 'Ga akkoord  met de gevraagde voorwaarden.'
      } else if (status === 409) {
        errorMsg = 'Je bent al geregistreerd bij Netmobiel.'
      } else {
        errorMsg = error.response?.data.message ?? 'Netwerkstoring'
      }
      uiStore.actions.queueErrorNotification(errorMsg)
      return Promise.reject(status)
    })
}

function fetchMyProfileStatus(context: ActionContext) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me/status`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      return response.status
    })
    .catch((error) => {
      return Promise.reject(error.response?.status ?? 500)
    })
}

function fetchMyProfile(context: ActionContext) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      const profile = {
        ...response.data,
        image: createAbsoluteImageUrl(response.data.image),
      }
      mutations.setProfile(profile)
      return Promise.resolve(response.status)
    })
    .catch((error) => {
      // Cannot show error message, landing page will try to fetch profile
      // uiStore.actions.queueErrorNotification(
      //   `Fout bij het ophalen van het profiel`
      // )
      return Promise.reject(error.response?.status ?? 500)
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
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      const profile = {
        ...response.data,
        image: createAbsoluteImageUrl(response.data.image),
      }
      mutations.addPublicProfile(profile)
      return profile
    })
    .catch((problem) => {
      const error = problem as Error | AxiosError
      if (axios.isAxiosError(error)) {
        // eslint-disable-next-line
        console.warn(`Error fetching public profile - ${error.response?.status} ${error.response?.statusText}: ${error.response?.data?.message}`)
        // Don't trouble the user with public profile that seem absent ot so
        // uiStore.actions.queueErrorNotification(
        //   `Fout bij het ophalen van het profiel`
        // )
      } else {
        // eslint-disable-next-line
        console.warn(`Error fetching public profile - ${error}`)
      }
      return undefined
    })
}

function fetchProfiles(context: ActionContext, { keyword, role }: any) {
  const URL = `${PROFILE_BASE_URL}/profiles`
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: {
        text: keyword,
        role: role,
        details: false,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        const results: Page<PublicProfile> = response.data
        results.data.forEach((p) => {
          p.image = createAbsoluteImageUrl(p.image)
        })
        mutations.setSearchResults(results)
      }
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het zoeken naar profielen`
      )
    })
}

function fetchMyFavoriteLocations(context: ActionContext) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me/places`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: {
        offset: 0,
        maxResults: 100,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        mutations.setFavoriteLocations(response.data)
      }
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het ophalen van de favorieten`
      )
    })
}

function storeMyFavoriteLocation(context: ActionContext, { place }: any) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me/places`
  return axios
    .post(URL, place, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status === 201) {
        uiStore.actions.queueInfoNotification(`Favoriet is opgeslagen`)
      }
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(`Fout bij opslaan van de favoriet`)
    })
}

function deleteMyFavoriteLocation(context: ActionContext, { placeId }: any) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me/places/${placeId}`
  return axios
    .delete(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      uiStore.actions.queueInfoNotification(`Favoriet is verwijderd`)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het verwijderen van de favoriet`
      )
    })
}

function storeMySearchPreferences(context: ActionContext, payload: any) {
  // Insert payload into the profile object.
  const profile = {
    ...context.state.profile,
    searchPreferences: { ...payload },
  }
  return updateMyProfile(context, profile)
}

function storeMyRidePreferences(context: ActionContext, payload: any) {
  // Insert payload into the profile object.
  const profile = {
    ...context.state.profile,
    ridePlanOptions: { ...payload },
  }
  return updateMyProfile(context, profile)
}

function updateMyProfile(context: ActionContext, profile: Profile) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me`
  return axios
    .put(URL, profile, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status !== 204) {
        // eslint-disable-next-line
        console.warn(`updateProfile: Unexpected response ${response.status}`)
      }
      return true
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het opslaan van het profiel`
      )
      return false
    })
}

function updateMyProfileImage(context: ActionContext, { image }: any) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me/image`
  return axios
    .put(
      URL,
      { image },
      {
        headers: generateHeaders(
          GRAVITEE_PROFILE_SERVICE_API_KEY,
          delegatorId
        ) as AxiosRequestHeaders,
      }
    )
    .then((response) => {
      if (response.status !== 204) {
        // eslint-disable-next-line
        console.warn(`updateProfileImage: Unexpected response ${response.status}`)
      }
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het vervangen van de profielfoto`
      )
    })
}

/**
 * @param context: calling context
 * @param receiverId: the managed identity of the user receiving the compliments
 * @returns {Array<Object>} returns Array of compliments in the response.data
 */
function fetchUserCompliments(context: ActionContext, { receiverId }: any) {
  const delegatorId = context.state.delegatorId
  const usr = getters.getPublicUsers.get(receiverId)
  if (usr && usr.compliments.data.length > 0) {
    return Promise.resolve(usr.compliments)
  }
  const URL = `${PROFILE_BASE_URL}/compliments`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: { receiverId: receiverId },
    })
    .then((response) => {
      // @ts-ignore
      mutations.addPublicCompliments({
        profileId: receiverId,
        compliments: response.data,
      })
      return response.data
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het ophalen van de complimenten`
      )
      return emptyPage
    })
}

/**
 * Fetches the available compliments and sets the compliment types
 * that are available in the store
 */
function fetchComplimentTypes(context: ActionContext) {
  const URL = `${PROFILE_BASE_URL}/compliments/types`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      mutations.setComplimentTypes(response.data.complimentTypes)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het ophalen van de complimentdefinities`
      )
    })
}

/**
 * Adds a compliment to the user in the profile-service
 * @param actionContext
 * @param receiver: {id} the profile id of the receiver.
 * @param context: the context of the compliment
 * @param compliments: enum [ SAME_INTERESTS, ON_TIME, TALKS_EASILY, SOCIABLE, NEATLY, NICE_CAR ]
 * @returns undefined
 */
function addUserCompliments(
  actionContext: ActionContext,
  { receiver, context, compliments }: any
) {
  const delegatorId = actionContext.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/compliments`
  return axios
    .post(
      URL,
      { receiver, context, compliments },
      {
        headers: generateHeaders(
          GRAVITEE_PROFILE_SERVICE_API_KEY,
          delegatorId
        ) as AxiosRequestHeaders,
      }
    )
    .then((response) => {
      mutations.clearPublicCompliments(receiver.id)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het versturen van de complimenten`
      )
    })
}

/**
 * Removes a review of a user in the profile-service
 * @param actionContext: the calling context
 * @param receiverId: the id of the receiver
 * @param id: the id of the review
 * @returns undefined
 */
function removeUserCompliments(
  actionContext: ActionContext,
  { receiverId, complimentId }: any
) {
  const delegatorId = actionContext.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/compliments/${complimentId}`
  return axios
    .delete(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      // Also no message when saving...
      // uiStore.actions.queueInfoNotification(`Je complimenten zijn verwijderd!`)
      mutations.clearPublicCompliments(receiverId)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het verwijderen van de complimenten`
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
  const delegatorId = context.state.delegatorId
  const usr = getters.getPublicUsers.get(receiverId)
  if (usr && usr.reviews.data.length > 0) {
    return Promise.resolve(usr.reviews)
  }
  const URL = `${PROFILE_BASE_URL}/reviews`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: { receiverId: receiverId },
    })
    .then((response) => {
      // @ts-ignore
      mutations.addPublicReviews({
        profileId: receiverId,
        reviews: response.data,
      })
      return response.data
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het ophalen van de beoordelingen`
      )
      return emptyPage
    })
}

/**
 * Adds a review to the user in the profile-service
 * @param actionContext: the calling context
 * @param receiver: {id}
 * @param context: context of the review
 * @param review the review to add
 * @returns undefined
 */
function addUserReview(
  actionContext: ActionContext,
  { receiver, context, review }: any
) {
  const delegatorId = actionContext.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/reviews`
  return axios
    .post(
      URL,
      { receiver, context, review },
      {
        headers: generateHeaders(
          GRAVITEE_PROFILE_SERVICE_API_KEY,
          delegatorId
        ) as AxiosRequestHeaders,
      }
    )
    .then((response) => {
      mutations.clearPublicReviews(receiver.id)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het opslaan van de beoordeling`
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
function removeUserReview(
  actionContext: ActionContext,
  { receiverId, reviewId }: any
) {
  const delegatorId = actionContext.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/reviews/${reviewId}`
  return axios
    .delete(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      uiStore.actions.queueInfoNotification(`Je beoordeling is verwijderd!`)
      mutations.clearPublicReviews(receiverId)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het verwijderen van de beoordeling`
      )
    })
}

function fetchDelegation(context: ActionContext, delegationId: any) {
  const URL = `${PROFILE_BASE_URL}/delegations/${delegationId}`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      mutations.setDelegation(response.data)
      return response.status
    })
    .catch((error) => {
      mutations.setDelegation(null)
      return null
    })
}

function createDelegationErrorMessage(
  defaultMessage: string,
  error: Error | AxiosError
) {
  let userMsg = defaultMessage
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      const srvText = error.response.data.message
      if (srvText?.includes('No phone number set')) {
        userMsg = 'Gebruiker heeft geen telefoonnummer ingesteld'
      } else if (srvText.includes('Not a valid phone number')) {
        userMsg = 'Gebruiker heeft een ongeldig telefoonnummer'
      } else if (srvText.includes('The activation code is invalid')) {
        userMsg = 'De activeringscode is onjuist'
      }
    }
  }
  return userMsg
}

function requestDelegation(
  context: ActionContext,
  { delegateId, delegatorId }: any
) {
  const URL = `${PROFILE_BASE_URL}/delegations`
  return axios
    .post(
      URL,
      { delegateRef: delegateId, delegatorRef: delegatorId },
      {
        headers: generateHeaders(
          GRAVITEE_PROFILE_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    .then((response) => {
      if (response.status !== 201) {
        // eslint-disable-next-line
        console.warn(`requestDelegation: Unexpected status ${response.status}`)
      }
      uiStore.actions.queueInfoNotification(`Je machtiging is aangevraagd.`)
      return response.headers.location
    })
    .catch((problem) => {
      const msg = createDelegationErrorMessage(
        'Fout bij het aanvragen van de machtiging',
        problem
      )
      uiStore.actions.queueErrorNotification(msg)
    })
}

function repeatRequestDelegation(context: ActionContext, delegationId: string) {
  const URL = `${PROFILE_BASE_URL}/delegations/${delegationId}`
  return axios
    .put(URL, null, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status !== 204) {
        // eslint-disable-next-line
        console.warn(`repeatRequestDelegation: Unexpected status ${response.status}`)
      }
      uiStore.actions.queueInfoNotification(
        `Je machtiging is opnieuw aangevraagd.`
      )
    })
    .catch((problem) => {
      const msg = createDelegationErrorMessage(
        'Fout bij het opnieuw aanvragen van de machtiging',
        problem
      )
      uiStore.actions.queueErrorNotification(msg)
    })
}

function deleteDelegation(context: ActionContext, delegationId: string) {
  const URL = `${PROFILE_BASE_URL}/delegations/${delegationId}`
  return axios
    .delete(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status === 204) {
        uiStore.actions.queueInfoNotification(`Je machtiging is verwijderd!`)
      }
      return true
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het verwijderen van de machtiging`
      )
      return false
    })
}

function fetchDelegations(
  context: ActionContext,
  { delegateId, delegatorId, maxResults }: any
) {
  const URL = `${PROFILE_BASE_URL}/delegations`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: {
        delegate: delegateId,
        delegator: delegatorId,
        maxResults: maxResults ?? 50,
      },
    })
    .then((response) => {
      // Turn relative image URLs into absolute URLs.
      const delegations = response.data
      delegations.data.map((d: Delegation) => {
        d.delegate.image = createAbsoluteImageUrl(d.delegate.image)
        d.delegator.image = createAbsoluteImageUrl(d.delegator.image)
      })
      mutations.setDelegations(delegations)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het ophalen van de machtigingen`
      )
    })
}

function activateDelegation(
  context: ActionContext,
  { delegationId, activationCode }: any
) {
  const URL = `${PROFILE_BASE_URL}/delegations/${delegationId}/activations`
  return axios
    .post(
      URL,
      { activationCode },
      {
        headers: generateHeaders(
          GRAVITEE_PROFILE_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    .then((response) => {
      if (response.status !== 204) {
        // eslint-disable-next-line
        console.warn(`activateDelegation: Unexpected status ${response.status}`)
      }
      uiStore.actions.queueInfoNotification(`Je machtiging is actief.`)
      return response.headers.location
    })
    .catch((problem) => {
      const msg = createDelegationErrorMessage(
        'Fout bij het activeren van de machtiging',
        problem
      )
      uiStore.actions.queueErrorNotification(msg)
    })
}

function switchProfile(context: ActionContext, { delegatorId }: any) {
  // Is we don't have a delegate profile stored yet we will assume the
  // current user profile is the delegate. Otherwise do not touch.
  if (context.state.delegateProfile == null) {
    // A copy or should it be a deep copy?
    const profile = { ...context.state.profile }
    mutations.setDelegateProfile(profile)
  }
  // Switch on the delegation
  mutations.setDelegatorId(delegatorId)
  // Now caller must refresh GUI!
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
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions`
  return axios
    .post(URL, null, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      return Promise.resolve(
        response.status === 201 ? response.headers?.location : undefined
      )
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het aanmaken van de registratie van de enquête`
      )
      return Promise.reject()
    })
}

function fetchSurveys(context: ActionContext, params: string) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params,
    })
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve()
      }
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het opzoeken van de enquêtes`
      )
      return Promise.reject()
    })
}

function fetchSurvey(context: ActionContext, id: string) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions/${id}`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status === 200) {
        mutations.setSurveyInteraction(response.data)
      } else {
        mutations.setSurveyInteraction(null)
      }
      return Promise.resolve(response.data)
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het opzoeken van de registratie van de enquête`
      )
      return Promise.reject()
    })
}

function markSurveyRedirection(context: ActionContext, surveyId: string) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions/${surveyId}/on-redirect`
  return axios
    .put(URL, null, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      // Should be 204
    })
    .catch((error) => {
      // Ignore
    })
}

function markSurveySubmitted(context: ActionContext, surveyId: string) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/survey-interactions/${surveyId}/on-submit`
  return axios
    .put(URL, null, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      // Should be 204
      return Promise.resolve()
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        `Fout bij het registreren van de afronding van de enquête`
      )
      return Promise.reject()
    })
}

function fetchVersion(context: ActionContext) {
  const URL = `${PROFILE_BASE_URL}/version`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      mutations.setVersion(response.data)
      return response.status
    })
    .catch((error) => {
      return Promise.reject(error.response?.status ?? 500)
    })
}

function closeSessionLog(context: ActionContext) {
  return flushSessionLog(context, true)
}

function flushSessionLog(context: ActionContext, isFinal: boolean = false) {
  const delegatorId = context.state.delegatorId
  const URL = `${PROFILE_BASE_URL}/profiles/me/session-log`
  if (
    context.state.sessionLog == null ||
    context.state.sessionLog?.pageVisits.length === 0
  ) {
    return Promise.resolve()
  }
  // Make a local copy of the current list
  const localLog: UserSession = {
    ...context.state.sessionLog,
    pageVisits: [...context.state.sessionLog.pageVisits],
  }
  return axios
    .post(URL, localLog, {
      headers: generateHeaders(
        GRAVITEE_PROFILE_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
      params: {
        final: isFinal || undefined,
      },
    })
    .then((response) => {
      // Clear the list from the page visits just sent
      // Other pages may have been visited in the mean time
      mutations.clearPageVisits(localLog.pageVisits.length)
    })
    .catch((error) => {
      // Ignore errors
    })
}

export const buildActions = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  return {
    updateRealUser: psBuilder.dispatch(updateRealUser),

    createProfile: psBuilder.dispatch(createProfile),
    fetchMyProfileStatus: psBuilder.dispatch(fetchMyProfileStatus),
    fetchMyProfile: psBuilder.dispatch(fetchMyProfile),
    fetchPublicProfile: psBuilder.dispatch(fetchPublicProfile),
    fetchProfiles: psBuilder.dispatch(fetchProfiles),

    storeMySearchPreferences: psBuilder.dispatch(storeMySearchPreferences),
    storeMyRidePreferences: psBuilder.dispatch(storeMyRidePreferences),
    updateMyProfile: psBuilder.dispatch(updateMyProfile),
    updateMyProfileImage: psBuilder.dispatch(updateMyProfileImage),

    fetchMyFavoriteLocations: psBuilder.dispatch(fetchMyFavoriteLocations),
    storeMyFavoriteLocation: psBuilder.dispatch(storeMyFavoriteLocation),
    deleteMyFavoriteLocation: psBuilder.dispatch(deleteMyFavoriteLocation),

    fetchComplimentTypes: psBuilder.dispatch(fetchComplimentTypes),
    fetchUserCompliments: psBuilder.dispatch(fetchUserCompliments),
    addUserCompliments: psBuilder.dispatch(addUserCompliments),
    removeUserCompliments: psBuilder.dispatch(removeUserCompliments),

    fetchUserReviews: psBuilder.dispatch(fetchUserReviews),
    addUserReview: psBuilder.dispatch(addUserReview),
    removeUserReview: psBuilder.dispatch(removeUserReview),

    fetchDelegations: psBuilder.dispatch(fetchDelegations),
    fetchDelegation: psBuilder.dispatch(fetchDelegation),
    requestDelegation: psBuilder.dispatch(requestDelegation),
    repeatRequestDelegation: psBuilder.dispatch(repeatRequestDelegation),
    activateDelegation: psBuilder.dispatch(activateDelegation),
    deleteDelegation: psBuilder.dispatch(deleteDelegation),
    switchProfile: psBuilder.dispatch(switchProfile),

    createSurveyInvitation: psBuilder.dispatch(createSurveyInvitation),
    fetchSurveys: psBuilder.dispatch(fetchSurveys),
    fetchSurvey: psBuilder.dispatch(fetchSurvey),
    markSurveyRedirection: psBuilder.dispatch(markSurveyRedirection),
    markSurveySubmitted: psBuilder.dispatch(markSurveySubmitted),

    fetchVersion: psBuilder.dispatch(fetchVersion),
    flushSessionLog: psBuilder.dispatch(flushSessionLog),
    closeSessionLog: psBuilder.dispatch(closeSessionLog),
  }
}
