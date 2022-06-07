import Vue from 'vue'
import { ModuleBuilder } from 'vuex-typex'
import { CommunicatorUser, Conversation, Message, MessageState } from './types'
import { RootState } from '@/store/Rootstate'
import { Page } from '@/store/types'
import { assignPageResults } from '@/store/storeHelper'

function setActualConversations(
  state: MessageState,
  payload: Page<Conversation>
) {
  state.actualConversations = assignPageResults(
    state.actualConversations,
    payload
  )
}

function setArchivedConversations(
  state: MessageState,
  payload: Page<Conversation>
) {
  state.archivedConversations = assignPageResults(
    state.archivedConversations,
    payload
  )
}

function setConversation(state: MessageState, payload: Conversation | null) {
  state.conversation = payload
}

function setMessages(state: MessageState, messages: Page<Message>) {
  state.messages = assignPageResults(state.messages, messages)
}

function setUser(state: MessageState, user: CommunicatorUser) {
  state.user = user
}

export const buildMutations = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  return {
    setActualConversations: msBuilder.commit(setActualConversations),
    setArchivedConversations: msBuilder.commit(setArchivedConversations),
    setConversation: msBuilder.commit(setConversation),
    setMessages: msBuilder.commit(setMessages),
    setUser: msBuilder.commit(setUser),
  }
}
