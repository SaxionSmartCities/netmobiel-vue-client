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
  setSearchedLocation: (state, payload) => {
    state.searchedLocation = payload
  },
}
