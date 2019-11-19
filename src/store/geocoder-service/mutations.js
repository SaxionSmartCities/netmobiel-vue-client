export default {
  setGeocoderSuggestions: (state, payload) => {
    state.geocoder.suggestions = payload
  },
  setGeoLocationPicked: (state, payload) => {
    state.geocoder.pickedLocations[payload.field] = payload.suggestion
  },
  swapLocations: state => {
    let tmp = state.geocoder.pickedLocations.to
    state.geocoder.pickedLocations.to = state.geocoder.pickedLocations.from
    state.geocoder.pickedLocations.from = tmp
  },
}
