import { ModuleBuilder } from 'vuex-typex'
import { RegistrationState } from './types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  rsBuilder: ModuleBuilder<RegistrationState, RootState>
) => {
  const getRegistrationStatus = rsBuilder.read((state: RegistrationState) => {
    return state.submitStatus
  }, 'getRegistrationStatus')

  return {
    get getRegistrationStatus() {
      return getRegistrationStatus()
    },
  }
}
