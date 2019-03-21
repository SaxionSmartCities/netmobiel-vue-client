// import VueJwtDecode from 'vue-jwt-decode'

export default {
  saveUser: (state, payload) => {
    //old implementation
    // state.user.accessToken = payload.accessToken
    //
    // let decodedObject = VueJwtDecode.decode(payload.accessToken)
    // password is stored in the store, maybe change later
    state.user.name = payload.name
    state.user.email = payload.email
    state.user.password = payload.password
  },
  saveUserStep2: (state, payload) => {
    console.log('save user step 2')
    state.user.date = payload.date
    state.user.biography = payload.biography
  },
  saveUserStep3: (state, payload) => {
    console.log('save user step 3')
    state.user.maxWalkDistance = payload.maxWalkDistance
    state.user.flexibility = payload.flexibility
    state.user.rideBaggage = payload.rideBaggage
  },
  saveUserStep4: (state, payload) => {
    console.log('save user step 4')
    state.user.conveyancePreferences = payload.conveyancePreferences
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
}
