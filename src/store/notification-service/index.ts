import { NotificationState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import nsActions from '@/store/notification-service/actions'

export const nsBuilder = storeBuilder.module<NotificationState>(
  'ns',
  new NotificationState()
)
export const actions = nsActions
