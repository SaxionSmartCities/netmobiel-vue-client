// import VueJwtDecode from 'vue-jwt-decode'

export default {
  saveUser: (state, payload) => {
    //old implementation
    // state.user.accessToken = payload.accessToken
    //
    // let decodedObject = VueJwtDecode.decode(payload.accessToken)
    // password is stored in the store, maybe change later
    for (var key in payload) {
      if (payload.hasOwnProperty(key)) {
        state.user[key] = payload[key]
      }
    }
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
  incrementRegistrationStep: (state, payload) => {
    state.ui.registrationStep += payload
  },
  storeRegistrationRequest: (state, payload) => {
    state.registrationRequest.first_name = payload.firstName
    state.registrationRequest.last_name = payload.lastName
    state.registrationRequest.email = payload.email
  },
}
