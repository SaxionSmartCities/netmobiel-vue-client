export default {
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
}
