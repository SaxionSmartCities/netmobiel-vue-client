export default {
  storeRegistrationRequest: (state, payload) => {
    state.registrationRequest.firstName = payload.firstName
    state.registrationRequest.lastName = payload.lastName
    state.registrationRequest.email = payload.email
    state.registrationRequest.address = { ...payload.address }
    state.registrationRequest.userRole = payload.userRole
    state.registrationRequest.consent = { ...payload.consent }
  },
  setRegistrationStatus: (state, payload) => {
    state.registrationRequest.submitStatus = payload
  },
  clearRegistrationRequest: state => {
    state.registrationRequest = {
      firstName: '',
      lastName: '',
      email: '',
      address: {
        locality: '',
      },
      userRole: '',
      consent: {
        olderThanSixteen: false,
        acceptedTerms: false,
      },
      submitStatus: {
        success: undefined,
        message: '',
      },
    }
  },
}
