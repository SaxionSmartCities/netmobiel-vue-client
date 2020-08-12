export class RegistrationState {
  registrationRequest: RegistrationRequest = {
    address: { locality: '' },
    consent: { acceptedTerms: false, olderThanSixteen: false },
    email: '',
    firstName: '',
    lastName: '',
    submitStatus: { message: '', success: false },
    userRole: '',
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
  submitStatus: SubmitStatus
}
