import { ModuleBuilder } from 'vuex-typex'
import { MessageState } from './types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  const getActualConversations = msBuilder.read((state: MessageState) => {
    return state.actualConversations
  }, 'getActualConversations')

  const getArchivedConversations = msBuilder.read((state: MessageState) => {
    return state.archivedConversations
  }, 'getArchivedConversations')

  const getConversation = msBuilder.read((state: MessageState) => {
    return state.conversation
  }, 'getConversation')

  const getMessages = msBuilder.read((state: MessageState) => {
    return state.messages
  }, 'getMessages')

  const getUser = msBuilder.read((state: MessageState) => {
    return state.user
  }, 'getUser')

  const getDeviceFcmToken = msBuilder.read((state: MessageState) => {
    return state.deviceFcmToken
  }, 'getDeviceFcmToken')

  return {
    get getActualConversations() {
      return getActualConversations()
    },
    get getArchivedConversations() {
      return getArchivedConversations()
    },
    get getConversation() {
      return getConversation()
    },
    get getMessages() {
      return getMessages()
    },
    get getUser() {
      return getUser()
    },
    get getDeviceFcmToken() {
      return getDeviceFcmToken()
    },
  }
}
