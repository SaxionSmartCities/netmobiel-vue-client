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
  enableHeader: state => {
    state.ui.header.visible = true
  },
  disableHeader: state => {
    state.ui.header.visible = false
  },
  enableFooter: state => {
    state.ui.footer.visible = true
  },
  disableFooter: state => {
    state.ui.footer.visible = false
  },
  deleteAccessToken: state => {
    state.user.accessToken = null
  },
  incrementRegistrationStep: (state, payload) => {
    state.ui.registrationStep += payload
  },
  storeRegistrationRequest: (state, payload) => {
    state.registrationRequest.first_name = payload.firstName
    state.registrationRequest.last_name = payload.lastName
    state.registrationRequest.email = payload.email
  },
  setRegistrationStatus: (state, payload) => {
    state.registrationRequest.submitStatus = payload
  },
  clearRegistrationRequest: state => {
    state.registrationRequest = {
      first_name: '',
      last_name: '',
      email: '',
      submitStatus: {
        success: undefined,
        message: '',
      },
    }
  },
  setRideSearchPreferences: (state, payload) => {
    state.user.rideSearchPreferences = payload
  },
  setSearchedLocation: (state, payload) => {
    state.searchedLocation = payload
  },
  setDate: (state, payload) => {
    state.searchRide.dateTime = payload
  },
  setPrivacySecurityValue: (state, payload) => {
    state.user.privacySecurity.filter(function(item) {
      if (item.name === payload.key) {
        item.value = payload.value
        return item
      }
    })
  },
  storePlanningRequest: (state, payload) => {
    state.planningRequest.fromPlace = payload.fromPlace
    state.planningRequest.toPlace = payload.toPlace
  },
  setPlanningStatus: (state, payload) => {
    state.planningRequest.submitStatus = payload
  },
  setPlanningResults: (state, payload) => {
    state.planningRequest.result = payload
  },
  clearPlanningResults: state => {
    state.planningRequest.result.data = ''
  },
  clearPlanningRequest: state => {
    state.planningRequest.submitStatus = {
      status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
      message: '',
    }
  },
  sortItineraries: (state, payload) => {
    state.planningRequest.result.data.itineraries.sort(payload)
  },
  setGeocoderSuggestions: (state, payload) =>
    (state.geocoder.suggestions = payload),
  hideBackButton: state => {
    state.ui.backButtonVisible = false
  },
  showBackButton: state => {
    state.ui.backButtonVisible = true
  },
  setSelectedItinerary: (state, payload) => {
    state.selectedItinerary = payload
  },
  setGeoLocationPicked: (state, payload) => {
    if (payload.field === 'to') {
      state.geocoder.pickedLocations.to = payload.pos
    } else if (payload.field === 'from') {
      state.geocoder.pickedLocations.from = payload.pos
    }
  },
  setNotificationOptionsValue: (state, payload) => {
    state.user.notificationOptions.filter(function(item) {
      if (item.name === payload.key) {
        item.value = payload.value
        return item
      }
    })
  },
  setProfileOptionsValue: (state, payload) => {
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
  setRideOfferPreferencesRepeat: (state, payload) => {
    const keys = Object.keys(state.user.rideOfferPreferences)
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === Object.keys(payload)[0]) {
        state.user.rideOfferPreferences[keys[i]] = payload[keys[i]]
        break
      }
    }
  },
  setRideOffer: (state, payload) => {
    state.user.offeredRides.push(payload)
  },
  addCar: (state, payload) => {
    state.user.cars.push(payload)
  },
  updateCarInfo: (state, payload) => {
    let oldLicense = payload.oldLicense
    Object.assign(
      state.user.cars.find(car => car.license === oldLicense),
      payload.result
    )
  },
  updateCarColor: (state, payload) => {
    state.user.cars.find(car => car.license === payload.license).color =
      payload.color
  },
  setChauffeurValue: (state, payload) => {
    state.user.chauffeur = payload
  },
  deleteCar: (state, payload) => {
    let indexOfTheCar = state.user.cars.findIndex(
      car => car.license === payload
    )
    state.user.cars.splice(indexOfTheCar, 1)
  },
  setTempCar: (state, payload) => {
    state.user.tempCar = payload
  },
}
