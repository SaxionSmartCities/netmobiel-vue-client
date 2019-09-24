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
          context.commit('setProfile', response.data.profiles[0])
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  storeRidePreferences: (context, payload) => {
    // Convert payload to a profile object.
    let profile = { ...context.state.user.profile }
    profile.ridePreferences = {
      numPassengers: payload.numPassengers,
      allowTransfer: payload.allowTransfer,
      maximumTransferTime: payload.maximumTransferTime,
      luggageOptions: payload.luggageOptions,
      allowedTravelModes: payload.allowedTravelModes,
    }
    const URL = BASE_URL + '/profiles/' + context.state.user.profile.id
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
