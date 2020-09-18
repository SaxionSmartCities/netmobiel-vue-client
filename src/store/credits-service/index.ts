import { CreditsState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/credits-service/getters'
import { buildMutations } from '@/store/credits-service/mutations'
import { buildActions } from '@/store/credits-service/actions'

export const gcBuilder = storeBuilder.module<CreditsState>(
  'crs',
  new CreditsState()
)

export const getters = buildGetters(gcBuilder)
export const mutations = buildMutations(gcBuilder)
export const actions = buildActions(gcBuilder)
