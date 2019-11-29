import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL
const GRAVITEE_PROFILE_SERVICE_API_KEY = config.GRAVITEE_PROFILE_SERVICE_API_KEY

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
  storeSearchPreferences: (context, payload) => {
    // Convert payload to a profile object.
    let profile = { ...context.state.user.profile }
    profile.searchPreferences = {
      numPassengers: payload.numPassengers,
      allowTransfer: payload.allowTransfer,
      maximumTransferTime: payload.maximumTransferTime,
      luggageOptions: payload.luggageOptions,
      allowedTravelModes: payload.allowedTravelModes,
    }
    context.dispatch('updateProfile', profile)
  },
  storeFcmToken: (context, payload) => {
    let profile = { ...context.state.user.profile }
    profile.fcmToken = payload.fcmToken
    profile.firstName = 'Test'
    context.dispatch('updateProfile', profile)
  },
  deleteRidePlanOptionsCar: (context, car) => {
    // Delete car from profile.
    context.commit('deleteRidePlanOptionsCar', car)
    // Remove car from rideshare.
    context.dispatch('cs/removeCar', car, { root: true })
    // Update profile in the backend
    let profile = { ...context.state.user.profile }
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
          context.commit('setProfile', response.data.profiles[0])
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
