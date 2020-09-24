import axios from 'axios'
import config from '@/config/config'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { Profile, ProfileState } from '@/store/profile-service/types'
import { RootState } from '@/store/Rootstate'
import { mutations } from '@/store/profile-service'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<ProfileState, RootState>

const BASE_URL = config.BASE_URL
const GRAVITEE_PROFILE_SERVICE_API_KEY = config.GRAVITEE_PROFILE_SERVICE_API_KEY
const GRAVITEE_COMPLIMENT_SERVICE_API_KEY =
  config.GRAVITEE_COMPLIMENT_SERVICE_API_KEY
const GRAVITEE_REVIEW_SERVICE_API_KEY = config.GRAVITEE_REVIEW_SERVICE_API_KEY

function generateHeader(key: any) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

function fetchProfile(context: ActionContext) {
  const URL = BASE_URL + '/profiles'
  axios
    .get(URL, { headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY) })
    .then(response => {
      if (response.status == 200 && response.data.profiles.length > 0) {
        let profile = {
          ...context.state.user.profile,
          ...response.data.profiles[0],
        }
        const imgSrc = `${BASE_URL}${response.data.profiles[0].image}`
        profile.image = imgSrc
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
  const URL = BASE_URL + '/profiles/' + profileId
  return axios
    .get(URL, {
      headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.data.profiles.length > 0) {
        let profile = { ...response.data.profiles[0] }
        profile.dateOfBirth = Date.parse(response.data.profiles[0].dateOfBirth)
        console.log(profile)
        mutations.setPublicProfile(profile)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueInfoNotification(
        `Fout bij het ophalen van het profiel`
      )
    })
}

/**
 * @param profileId: the user his managed Identity (keycloak)
 * @returns {Array<Object>} returns Array of compliments in the response.data
 */
function fetchUserCompliments(context: ActionContext, { profileId }: any) {
  const URL = BASE_URL + '/compliments'
  return axios
    .get(URL, {
      headers: generateHeader(GRAVITEE_COMPLIMENT_SERVICE_API_KEY),
      params: { receiverId: profileId },
    })
    .then(response => {
      mutations.setPublicCompliments(response.data.compliments)
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
  const URL = BASE_URL + '/compliments/types'
  axios
    .get(URL, {
      headers: generateHeader(GRAVITEE_COMPLIMENT_SERVICE_API_KEY),
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
  const URL = BASE_URL + '/compliments'
  return axios
    .post(
      URL,
      { sender, receiver, complimentType },
      {
        headers: generateHeader(GRAVITEE_COMPLIMENT_SERVICE_API_KEY),
      }
    )
    .then(response => {
      return response
    })
}

/**
 * Fetches the reviews of a user based on the profileId
 * @returns {Array<Object>} Returns an Array of reviews in the response.data.reviews
 */
function fetchUserReviews(context: ActionContext, { profileId }: any) {
  const URL = BASE_URL + '/reviews'
  return axios
    .get(URL, {
      headers: generateHeader(GRAVITEE_REVIEW_SERVICE_API_KEY),
      params: { receiverId: profileId },
    })
    .then(response => {
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
  const URL = BASE_URL + '/reviews'
  return axios
    .post(
      URL,
      { sender, receiver, review },
      {
        headers: generateHeader(GRAVITEE_REVIEW_SERVICE_API_KEY),
      }
    )
    .then(response => {
      return response
    })
}

function storeFavoriteLocations(context: ActionContext, payload: any) {
  let profile = {
    ...context.state.user.profile,
    favoriteLocations: payload,
  }
  updateProfile(context, profile)
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
  const URL = BASE_URL + '/profiles/' + profile.id
  axios
    .put(URL, profile, {
      headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(response => {
      if (response.status == 200 && response.data.profiles.length > 0) {
        let profile = {
          ...context.state.user.profile,
          ...response.data.profiles[0],
        }
        const imgSrc = `${BASE_URL}${response.data.profiles[0].image}`
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
  const URL = `${BASE_URL}/profiles/${id}/image`
  axios
    .put(
      URL,
      { image },
      {
        headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY),
      }
    )
    .then(response => {
      if (response.status === 200) {
        const imgSrc = `${BASE_URL}${response.data.profiles[0].image}`
        mutations.setProfileImage(imgSrc)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

export const buildActions = (
  psBuilder: ModuleBuilder<ProfileState, RootState>
) => {
  return {
    fetchProfile: psBuilder.dispatch(fetchProfile),
    fetchUserProfile: psBuilder.dispatch(fetchPublicProfile),
    fetchUserCompliments: psBuilder.dispatch(fetchUserCompliments),
    fetchComplimentTypes: psBuilder.dispatch(fetchComplimentTypes),
    addUserCompliment: psBuilder.dispatch(addUserCompliment),
    fetchUserReviews: psBuilder.dispatch(fetchUserReviews),
    addUserReview: psBuilder.dispatch(addUserReview),
    storeFavoriteLocations: psBuilder.dispatch(storeFavoriteLocations),
    storeSearchPreferences: psBuilder.dispatch(storeSearchPreferences),
    storeRidePreferences: psBuilder.dispatch(storeRidePreferences),
    storeFcmToken: psBuilder.dispatch(storeFcmToken),
    updateProfile: psBuilder.dispatch(updateProfile),
    updateProfileImage: psBuilder.dispatch(updateProfileImage),
  }
}
