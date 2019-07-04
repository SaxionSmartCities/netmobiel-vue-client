export default {
  getUser: state => {
    return state.user
  },
  isHeaderVisible: state => {
    return state.ui.header.visible
  },
  isFooterVisible: state => {
    return state.ui.footer.visible
  },
  getRegistrationStep: state => {
    return state.ui.registrationStep
  },
  getCurrentDate: state => {
    return new Date(state.user.dateOfBirth)
  },
  getRegistrationStatus: state => {
    return state.registrationRequest.submitStatus
  },
  getRideSearchPreferences: state => {
    return state.user.rideSearchPreferences
  },
  getPlanningStatus: state => {
    return state.planningRequest.submitStatus
  },
  getPrivacySecurity: state => {
    return state.user.privacySecurity
  },
  getItineraries: state => {
    return state.planningRequest.result.data.itineraries
  },
  getGeocoderSuggestions: state => state.geocoder.suggestions,
  isBackButtonVisible: state => {
    return state.ui.backButtonVisible
  },
  getSelectedItinerary: state => state.selectedItinerary,

  getGeocoderPickedLocations: state => state.geocoder.pickedLocations,

  getFromLocation: state => {
    return state.geocoder.pickedLocations.from
  },

  getToLocation: state => {
    return state.geocoder.pickedLocations.to
  },
}
