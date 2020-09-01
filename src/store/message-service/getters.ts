import { ModuleBuilder } from 'vuex-typex'
import { MessageState } from './types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  const getMessages = (urn: any) => {
    msBuilder.read((state: MessageState) => {
      return state.messages.get(urn)
    }, 'getMessages')
  }

  const getActiveMessages = msBuilder.read((state: MessageState) => {
    return state.activeMessages
  }, 'getActiveMessages')

  const getMessagesNormal = msBuilder.read((state: MessageState) => {
    return state.messages
  }, 'getMessagesNormal')

  const getConversations = msBuilder.read((state: MessageState) => {
    return state.conversations
  }, 'getConversations')

  const getConversationByContext = (ctx: any) => {
    msBuilder.read((state: MessageState) => {
      return state.conversations.find(conv => conv.context === ctx)
    }, 'getConversationByContext')
  }

  return {
    //@ts-ignore
    get getMessages() {
      return getMessages
    },
    get getActiveMessages() {
      return getActiveMessages()
    },
    get getMessagesNormal() {
      return getMessagesNormal()
    },
    get getConversations() {
      return getConversations()
    },
    //@ts-ignore
    get getConversationByContext() {
      return getConversationByContext
    },
  }
}
