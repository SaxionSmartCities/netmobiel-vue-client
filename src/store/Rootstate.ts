import { getStoreBuilder } from 'vuex-typex'
import { UiState } from './ui/types'

export interface RootState {
  ui: UiState
}

export const storeBuilder = getStoreBuilder<RootState>()
