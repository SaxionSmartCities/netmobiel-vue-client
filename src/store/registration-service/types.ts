export class RegistrationState {
  registrationRequest: RegistrationRequest = {
    address: { locality: '' },
    consent: { acceptedTerms: false, olderThanSixteen: false },
    email: '',
    firstName: '',
    lastName: '',
    submitStatus: { message: '', success: null },
    userRole: '',
  }
}

export interface RegistrationRequest {
  firstName: ''
  lastName: ''
  email: ''
  address: {
    locality: ''
  }
  userRole: ''
  consent: {
    olderThanSixteen: false
    acceptedTerms: false
  }
  submitStatus: {
    success: null
    message: ''
  }
}
