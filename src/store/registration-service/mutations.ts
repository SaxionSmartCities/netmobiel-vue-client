import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { RegistrationState } from './types'
// @ts-ignore
const rsBuilder: ModuleBuilder = getStoreBuilder().module('rs')

function storeRegistrationRequest(state: RegistrationState, payload: any) {
  state.registrationRequest.firstName = payload.firstName
  state.registrationRequest.lastName = payload.lastName
  state.registrationRequest.email = payload.email
  state.registrationRequest.address = { ...payload.address }
  state.registrationRequest.userRole = payload.userRole
  state.registrationRequest.consent = { ...payload.consent }
}

function setRegistrationStatus(state: RegistrationState, payload: any) {
  state.registrationRequest.submitStatus = payload
}

function clearRegistrationRequest(state: RegistrationState, payload: any) {
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
      success: null,
      message: '',
    },
  }
}

export default {
  storeRegistrationRequest: rsBuilder.commit(storeRegistrationRequest),
  setRegistrationStatus: rsBuilder.commit(setRegistrationStatus),
  clearRegistrationRequest: rsBuilder.commit(clearRegistrationRequest),
}
