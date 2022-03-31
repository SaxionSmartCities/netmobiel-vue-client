import { getStoreBuilder } from 'vuex-typex'
import { UiState } from './ui/types'
import { BankerState } from '@/store/banker-service/types'
import { CarpoolState } from '@/store/carpool-service/types'
import { ProfileState } from '@/store/profile-service/types'
import { GeoCoderState } from '@/store/geocoder-service/types'
import { ItineraryState } from '@/store/itinerary-service/types'
import { MessageState } from '@/store/message-service/types'

export interface RootState {
  bs: BankerState
  cs: CarpoolState
  gs: GeoCoderState
  is: ItineraryState
  ms: MessageState
  ps: ProfileState
  ui: UiState
}

export const storeBuilder = getStoreBuilder<RootState>()
