import { MessageState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/message-service/getters'
import { buildMutations } from '@/store/message-service/mutations'
import { buildActions } from '@/store/message-service/actions'

export const msBuilder = storeBuilder.module<MessageState>(
  'ms',
  new MessageState()
)

export const getters = buildGetters(msBuilder)
export const mutations = buildMutations(msBuilder)
export const actions = buildActions(msBuilder)
