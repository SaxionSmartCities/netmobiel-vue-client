import { BankerState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/banker-service/getters'
import { buildMutations } from '@/store/banker-service/mutations'
import { buildActions } from '@/store/banker-service/actions'

export const bsBuilder = storeBuilder.module<BankerState>(
  'bs',
  new BankerState()
)
export const getters = buildGetters(bsBuilder)
export const mutations = buildMutations(bsBuilder)
export const actions = buildActions(bsBuilder)
