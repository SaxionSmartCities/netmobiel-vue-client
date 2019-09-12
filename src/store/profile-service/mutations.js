import VueJwtDecode from 'vue-jwt-decode'

export default {
  setUserToken: (state, token) => {
    state.user.accessToken = token

    let decodedObject = VueJwtDecode.decode(token)
    state.user.givenName = decodedObject['given_name']
    state.user.familyName = decodedObject['family_name']
    state.user.email = decodedObject['email']
    state.user.fullName = decodedObject['name']
  },
  deleteAccessToken: state => {
    state.user.accessToken = null
  },
  setProfile: (state, payload) => {
    state.user.profile = payload
  },
  setNotificationOptionsValue: (state, payload) => {
    state.user.notificationOptions.filter(function(item) {
      if (item.name === payload.key) {
        item.value = payload.value
        return item
      }
    })
  },
  setTripOptionsValue: (state, payload) => {
    state.user.profile.filter(function(item) {
      if (item.name === payload.key) {
        item.value = payload.value
        return item
      }
    })
  },
  setReviewOptionsValue: (state, payload) => {
    state.user.reviews.filter(function(item) {
      if (item.name === payload.key) {
        item.value = payload.value
        return item
      }
    })
  },
  setRidePreferences: (state, payload) => {
    state.user.ridePreferences = payload
  },
  setPrivacySecurityValue: (state, payload) => {
    state.user.privacySecurity.filter(function(item) {
      if (item.name === payload.key) {
        item.value = payload.value
        return item
      }
    })
  },
}
