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
    state.user.tripOptions.filter(function(item) {
      if (item.name === payload.key) {
        item.value = payload.value
        return
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
  setRidePlanOptions: (state, payload) => {
    console.log('payload', payload)
    state.user.profile.ridePlanOptions = payload
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
