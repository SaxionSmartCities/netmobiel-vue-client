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
  setCreditAmount: (state, payload) => {
    state.user.credits.creditAmount = payload
  },
  setCreditHistory: (state, payload) => {
    state.user.credits.creditHistory = payload
  },
  setReviewOptionsValue: (state, payload) => {
    state.user.reviews.filter(function(item) {
      if (item.name === payload.key) {
        item.value = payload.value
        return item
      }
    })
  },
  setRidePlanOptions: (state, payload) => {
    state.user.profile.ridePlanOptions = payload
  },
  addRidePlanOptionsCar: (state, payload) => {
    let isPresent = false
    const currentCars = state.user.profile.ridePlanOptions.cars
    for (let i = 0; i < currentCars.length; i++) {
      if (payload.licensePlate === currentCars[i].licensePlate) {
        isPresent = true
        break
      }
    }
    if (!isPresent) {
      state.user.profile.ridePlanOptions.cars.push(payload)
    }
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
