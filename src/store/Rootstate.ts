import { getStoreBuilder } from 'vuex-typex'
import { UiState } from './ui/types'
import { CharityState } from '@/store/charity-service/types'
import { CarpoolState } from '@/store/carpool-service/types'
import { ProfileState } from '@/store/profile-service/types'
import { NotificationState } from '@/store/notification-service/types'

export interface RootState {
  ns: NotificationState
  ps: ProfileState
  cs: CarpoolState
  chs: CharityState
  ui: UiState
}

export const storeBuilder = getStoreBuilder<RootState>()
