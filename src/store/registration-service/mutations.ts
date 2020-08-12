import { ModuleBuilder } from 'vuex-typex'
import { RegistrationRequest, RegistrationState, SubmitStatus } from './types'
import { RootState } from '@/store/Rootstate'

function storeRegistrationRequest(
  state: RegistrationState,
  payload: RegistrationRequest
) {
  state.registrationRequest.firstName = payload.firstName
  state.registrationRequest.lastName = payload.lastName
  state.registrationRequest.email = payload.email
  state.registrationRequest.address = { ...payload.address }
  state.registrationRequest.userRole = payload.userRole
  state.registrationRequest.consent = { ...payload.consent }
}

function setRegistrationStatus(
  state: RegistrationState,
  payload: SubmitStatus
) {
  state.registrationRequest.submitStatus = payload
}

function clearRegistrationRequest(state: RegistrationState) {
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
      success: false,
      message: '',
    },
  }
}
export const buildMutations = (
  rsBuilder: ModuleBuilder<RegistrationState, RootState>
) => {
  return {
    storeRegistrationRequest: rsBuilder.commit(storeRegistrationRequest),
    setRegistrationStatus: rsBuilder.commit(setRegistrationStatus),
    clearRegistrationRequest: rsBuilder.commit(clearRegistrationRequest),
  }
}
