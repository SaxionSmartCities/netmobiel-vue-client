export default {
  storeRegistrationRequest: (state, payload) => {
    state.registrationRequest.firstName = payload.firstName
    state.registrationRequest.lastName = payload.lastName
    state.registrationRequest.email = payload.email
  },
  setRegistrationStatus: (state, payload) => {
    state.registrationRequest.submitStatus = payload
  },
  clearRegistrationRequest: state => {
    state.registrationRequest = {
      firstName: '',
      lastName: '',
      email: '',
      submitStatus: {
        success: undefined,
        message: '',
      },
    }
  },
}
