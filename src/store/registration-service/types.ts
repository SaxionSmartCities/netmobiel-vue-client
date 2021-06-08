export class RegistrationState {
  registrationRequest: RegistrationRequest = {
    address: { locality: '' },
    consent: { acceptedTerms: false, olderThanSixteen: false },
    email: '',
    firstName: '',
    lastName: '',
    userRole: '',
  }
  submitStatus: SubmitStatus = {
    message: '',
    success: false,
  }
}

export interface SubmitStatus {
  success: boolean
  message?: string
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
}
