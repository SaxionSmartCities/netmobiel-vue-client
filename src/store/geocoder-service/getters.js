export default {
  getGeocoderSuggestions: state => state.geocoder.suggestions,

  getGeocoderPickedLocations: state => state.geocoder.pickedLocations,
  getFromLocation: state => {
    return state.geocoder.pickedLocations.from
  },
  getToLocation: state => {
    return state.geocoder.pickedLocations.to
  },
}
