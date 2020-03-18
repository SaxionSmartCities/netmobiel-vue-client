import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL
const GRAVITEE_PROFILE_SERVICE_API_KEY = config.GRAVITEE_PROFILE_SERVICE_API_KEY
const GRAVITEE_RIDESHARE_SERVICE_API_KEY =
  config.GRAVITEE_RIDESHARE_SERVICE_API_KEY

function generateHeader(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  fetchProfile: context => {
    const URL = BASE_URL + '/profiles'
    axios
      .get(URL, { headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY) })
      .then(response => {
        if (response.status == 200 && response.data.profiles.length > 0) {
          let profile = {
            ...context.state.user.profile,
            ...response.data.profiles[0],
          }
          if (!!localStorage.fcm && localStorage.fcm !== profile.fcmToken) {
            profile.fcmToken = localStorage.fcm
            context.dispatch('updateProfile', profile)
          } else {
            context.commit('setProfile', profile)
          }
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchUser: async (context, { userId }) => {
    const URL = BASE_URL + `/rideshare/users/${userId}`
    return await axios
      .get(URL, { headers: generateHeader(GRAVITEE_RIDESHARE_SERVICE_API_KEY) })
      .then(response => {
        console.log('fetched user from rideshare response... ', response)
        return response.data
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  storeFavoriteLocations: (context, payload) => {
    let profile = {
      ...context.state.user.profile,
      favoriteLocations: payload,
    }
    context.dispatch('updateProfile', profile)
  },
  storeSearchPreferences: (context, payload) => {
    // Convert payload to a profile object.
    let profile = {
      ...context.state.user.profile,
      searchPreferences: { ...payload },
    }
    context.dispatch('updateProfile', profile)
  },
  storeRidePreferences: (context, payload) => {
    // Convert payload to a profile object.
    let profile = {
      ...context.state.user.profile,
      ridePlanOptions: { ...payload },
    }
    context.dispatch('updateProfile', profile)
  },
  storeFcmToken: (context, payload) => {
    let profile = { ...context.state.user.profile }
    profile.fcmToken = payload.fcmToken
    profile.firstName = 'Test'
    context.dispatch('updateProfile', profile)
  },
  updateProfile: (context, profile) => {
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
          context.commit('setProfile', profile)
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
