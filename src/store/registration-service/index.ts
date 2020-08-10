import { RegistrationState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import rsGetters from '@/store/registration-service/getters'
import rsMutations from '@/store/registration-service/mutations'
import rsActions from '@/store/registration-service/actions'

export const rsBuilder = storeBuilder.module<RegistrationState>(
  'rs',
  new RegistrationState()
)
export const getters = rsGetters
export const mutations = rsMutations
export const actions = rsActions
