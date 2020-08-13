import { UiState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/ui/getters'
import { buildMutations } from '@/store/ui/mutations'
import { buildActions } from '@/store/ui/actions'

export const uiBuilder = storeBuilder.module<UiState>('ui', new UiState())
export const getters = buildGetters(uiBuilder)
export const mutations = buildMutations(uiBuilder)
export const actions = buildActions(uiBuilder)
