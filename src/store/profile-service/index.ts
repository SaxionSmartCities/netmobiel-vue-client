import { ProfileState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import psGetters from '@/store/profile-service/getters.ts'
import psMutations from '@/store/profile-service/mutations'
import psActions from '@/store/profile-service/actions'

export const psBuilder = storeBuilder.module<ProfileState>(
  'ps',
  new ProfileState()
)
export const getters = psGetters
export const mutations = psMutations
export const actions = psActions
