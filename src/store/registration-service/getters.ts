import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { RegistrationState } from './types'

// @ts-ignore
const rsBuilder: ModuleBuilder = getStoreBuilder().module('rs')

const getRegistrationStatus = rsBuilder.read((state: RegistrationState) => {
  return state.registrationRequest.submitStatus
}, 'getRegistrationStatus')

export default {
  get getRegistrationStatus() {
    return getRegistrationStatus()
  },
}
