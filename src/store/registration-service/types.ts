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
  firstName: string
  lastName: string
  email: string
  address: {
    locality: string
  }
  userRole: string
  consent: {
    olderThanSixteen: false
    acceptedTerms: false
  }
}
