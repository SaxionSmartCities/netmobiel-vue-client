export default {
  getGeocoderSuggestions: state => state.geocoder.suggestions,
  getPickedLocation: state => state.geocoder.pickedLocations,
  getPreFilledTime: state => state.geocoder.preFilledTime,
}
