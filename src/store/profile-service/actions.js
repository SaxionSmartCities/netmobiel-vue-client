import axios from 'axios'
import config from '@/config/config'
import moment from 'moment'

const BASE_URL = config.BASE_URL
const GRAVITEE_PROFILE_SERVICE_API_KEY = config.GRAVITEE_PROFILE_SERVICE_API_KEY
const GRAVITEE_RIDESHARE_SERVICE_API_KEY =
  config.GRAVITEE_RIDESHARE_SERVICE_API_KEY
const GRAVITEE_COMPLIMENT_SERVICE_API_KEY =
  config.GRAVITEE_COMPLIMENT_SERVICE_API_KEY
const GRAVITEE_REVIEW_SERVICE_API_KEY = config.GRAVITEE_REVIEW_SERVICE_API_KEY

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
          const imgSrc = `${BASE_URL}${response.data.profiles[0].image}`
          profile.image = imgSrc
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
  fetchUserProfile: (context, { profileId }) => {
    const URL = BASE_URL + '/profiles/' + profileId
    return axios
      .get(URL, {
        headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY),
      })
      .then(response => {
        return response.data.profiles[0]
      })
  },
  /**
   * @param profileId: the user his managed Identity (keycloak)
   * @returns {Array<Object>} returns Array of compliments in the response.data
   */
  fetchUserCompliments: (context, { profileId }) => {
    const URL = BASE_URL + '/compliments'
    return axios
      .get(URL, {
        headers: generateHeader(GRAVITEE_COMPLIMENT_SERVICE_API_KEY),
        params: { receiverId: profileId },
      })
      .then(response => {
        return response.data
      })
  },
  /**
   * Fetches the available compliments and sets the compliment types
   * that are available in the store
   */
  fetchComplimentTypes: context => {
    const URL = BASE_URL + '/compliments/types'
    axios
      .get(URL, {
        headers: generateHeader(GRAVITEE_COMPLIMENT_SERVICE_API_KEY),
      })
      .then(response => {
        context.commit('setComplimentTypes', response.data.complimentTypes)
      })
  },
  /**
   * Adds a compliment to the user in the profile-service
   * @param sender: {id, firstName, lastName}
   * @param receiver: {id, firstName, lastName}
   * @returns {Object} Returns the compliment object in the response.data
   */
  addUserCompliment: (context, { sender, receiver, complimentType }) => {
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
  },
  /**
   * Fetches the reviews of a user based on the profileId
   * @returns {Array<Object>} Returns an Array of reviews in the response.data.reviews
   */
  fetchUserReviews: (context, { profileId }) => {
    const URL = BASE_URL + '/reviews'
    return axios
      .get(URL, {
        headers: generateHeader(GRAVITEE_REVIEW_SERVICE_API_KEY),
        params: { receiverId: profileId },
      })
      .then(response => {
        return response.data.reviews
      })
  },
  /**
   * Adds a review to the user in the profile-service
   * @param sender: {id, firstName, lastName}
   * @param receiver: {id, firstName, lastName}
   * @returns {Object} Returns the review object in the response.data
   */
  addUserReview: (context, { sender, receiver, review }) => {
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
        console.log('response for adding review', response)
        return response
      })
  },
  fetchUser: async (context, { userId }) => {
    const URL = BASE_URL + `/rideshare/users/${userId}`
    return axios
      .get(URL, { headers: generateHeader(GRAVITEE_RIDESHARE_SERVICE_API_KEY) })
      .then(response => {
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
          const imgSrc = `${BASE_URL}${response.data.profiles[0].image}`
          profile.image = imgSrc
          context.commit('setProfile', profile)
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  updateProfileImage: (context, { id, image }) => {
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
          context.commit('setProfileImage', imgSrc)
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchCreditAmount: context => {
    //TODO: Add backend call
    let amount = 89
    context.commit('setCreditAmount', amount)
  },
  // addCredits: (context, transaction) => {
  //   //TODO: Add backend call
  // },
  // addTransactionCreditAmount: (context, transaction) => {
  //   //TODO: Add backend call
  // },
  fetchCreditHistory: context => {
    //TODO: Add backend call
    let creditHistory = [
      {
        date: moment().subtract(2, 'weeks'),
        amount: 5,
        type: 'donation',
        otherParty: 'Tennisclub Vragender',
      },
      {
        date: moment()
          .subtract(6, 'days')
          .subtract(8, 'hours'),
        amount: -5,
        type: 'drive',
        otherParty: 'Marc de Vries',
        destinationRide: 'Lievelde',
      },
      {
        date: moment(),
        amount: -20,
        type: 'reward',
        otherParty: 'Bakkerij de Zoete inval',
      },
      {
        date: moment(),
        amount: 40,
        type: 'addedCredits',
      },
    ]
    context.commit('setCreditHistory', creditHistory)
  },
}
