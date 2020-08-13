import { RegistrationState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/registration-service/getters'
import { buildMutations } from '@/store/registration-service/mutations'
import { buildActions } from '@/store/registration-service/actions'

export const rsBuilder = storeBuilder.module<RegistrationState>(
  'rs',
  new RegistrationState()
)

export const getters = buildGetters(rsBuilder)
export const mutations = buildMutations(rsBuilder)
export const actions = buildActions(rsBuilder)
