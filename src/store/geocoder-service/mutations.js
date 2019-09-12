export default {
  setGeocoderSuggestions: (state, payload) =>
    (state.geocoder.suggestions = payload),
  setGeoLocationPicked: (state, payload) => {
    if (payload.field === 'to') {
      state.geocoder.pickedLocations.to = payload.pos
    } else if (payload.field === 'from') {
      state.geocoder.pickedLocations.from = payload.pos
    }
  },

  swapLocations: state => {
    let tmp = state.geocoder.pickedLocations.to
    state.geocoder.pickedLocations.to = state.geocoder.pickedLocations.from
    state.geocoder.pickedLocations.from = tmp
  },
}
