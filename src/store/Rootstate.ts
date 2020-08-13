import { getStoreBuilder } from 'vuex-typex'
import { UiState } from './ui/types'
import { CharityState } from '@/store/charity-service/types'
import { CarpoolState } from '@/store/carpool-service/types'
import { ProfileState } from '@/store/profile-service/types'
import { GeoCoderState } from '@/store/geocoder-service/types'
import { ItineraryState } from '@/store/itinerary-service/types'
import { MessageState } from '@/store/message-service/types'
import { NotificationState } from '@/store/notification-service/types'
import { RegistrationState } from '@/store/registration-service/types'

export interface RootState {
  chs: CharityState
  cs: CarpoolState
  gs: GeoCoderState
  is: ItineraryState
  ms: MessageState
  ns: NotificationState
  ps: ProfileState
  rs: RegistrationState
  ui: UiState
}

export const storeBuilder = getStoreBuilder<RootState>()
