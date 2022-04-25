import Vue from 'vue'
import { ModuleBuilder } from 'vuex-typex'
import { Conversation, Message, MessageState } from './types'
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

function setConversation(state: MessageState, payload: Conversation) {
  state.conversation = payload
}

function setMessages(state: MessageState, messages: Page<Message>) {
  state.messages = assignPageResults(state.messages, messages)
}

export const buildMutations = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  return {
    setActualConversations: msBuilder.commit(setActualConversations),
    setArchivedConversations: msBuilder.commit(setArchivedConversations),
    setConversation: msBuilder.commit(setConversation),
    setMessages: msBuilder.commit(setMessages),
  }
}
