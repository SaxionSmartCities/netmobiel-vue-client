import { ProfileState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/profile-service/getters.ts'
import { buildMutations } from '@/store/profile-service/mutations'
import psActions from '@/store/profile-service/actions'

export const psBuilder = storeBuilder.module<ProfileState>(
  'ps',
  new ProfileState()
)
export const getters = buildGetters(psBuilder)
export const mutations = buildMutations(psBuilder)
export const actions = psActions
