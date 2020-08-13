import { CharityState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/charity-service/getters'
import { buildMutations } from '@/store/charity-service/mutations'
import { buildActions } from '@/store/charity-service/actions'

export const chsBuilder = storeBuilder.module<CharityState>(
  'chs',
  new CharityState()
)
export const getters = buildGetters(chsBuilder)
export const mutations = buildMutations(chsBuilder)
export const actions = buildActions(chsBuilder)
