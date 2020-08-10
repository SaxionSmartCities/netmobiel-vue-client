import { getStoreBuilder } from 'vuex-typex'
import { UiState } from './ui/types'
import { CharityState } from '@/store/charity-service/types'
import { CarpoolState } from '@/store/carpool-service/types'

export interface RootState {
  cs: CarpoolState
  chs: CharityState
  ui: UiState
}

export const storeBuilder = getStoreBuilder<RootState>()
