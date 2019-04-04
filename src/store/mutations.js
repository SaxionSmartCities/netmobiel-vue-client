import VueJwtDecode from 'vue-jwt-decode'

export default {
  saveUser: (state, payload) => {
    state.user.accessToken = payload.accessToken

    var decodedObject = VueJwtDecode.decode(payload.accessToken)
    state.user.name = decodedObject.name
    state.user.email = decodedObject.email
  },
  enableHeader: state => {
    console.log('Enabling header')
    state.ui.header.visible = true
  },
  disableHeader: state => {
    console.log('Disabling header')
    state.ui.header.visible = false
  },
  enableFooter: state => {
    console.log('Enabling footer')
    state.ui.footer.visible = true
  },
  disableFooter: state => {
    console.log('Enabling footer')
    state.ui.footer.visible = false
  },
  deleteAccessToken: state => {
    console.log('Deleting access token')
    state.user.accessToken = null
  },
  setCurrentLocation: (state, locationId) => {
    console.log('Saving currently selected location')
    state.ui.selectedLocationId = locationId
  },
  updateLocation: (state, currentLocation) => {
    //Adding the right id to the currentLocation
    if (state.ui.selectedLocationId === -1) {
      currentLocation.id = state.user.locations.length
      state.user.locations.push(currentLocation)
    } else {
      currentLocation.id = state.ui.selectedLocationId
      state.user.locations[state.ui.selectedLocationId] = currentLocation
    }
  },
}
