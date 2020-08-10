import { MessageState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import msGetters from '@/store/message-service/getters'
import msMutations from '@/store/message-service/mutations'
import msActions from '@/store/message-service/actions'

export const msBuilder = storeBuilder.module<MessageState>(
  'ms',
  new MessageState()
)
export const getters = msGetters
export const mutations = msMutations
export const actions = msActions
