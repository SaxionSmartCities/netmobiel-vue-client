import { CharityState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import chsGetters from '@/store/charity-service/getters'
import chsMutations from '@/store/charity-service/mutations'
import chsActions from '@/store/charity-service/actions'

export const chsBuilder = storeBuilder.module<CharityState>(
  'chs',
  new CharityState()
)
export const getters = chsGetters
export const mutations = chsMutations
export const actions = chsActions
