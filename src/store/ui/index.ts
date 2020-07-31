import { UiState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import uiGetters from '@/store/ui/getters'
import uiMutations from '@/store/ui/mutations'
import uiActions from '@/store/ui/actions'

export const uiBuilder = storeBuilder.module<UiState>('ui', new UiState())
export const getters = uiGetters
export const mutations = uiMutations
export const actions = uiActions
