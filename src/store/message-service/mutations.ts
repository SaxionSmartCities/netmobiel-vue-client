import Vue from 'vue'
import { ModuleBuilder } from 'vuex-typex'
import { Conversation, Message, MessageState } from './types'
import { RootState } from '@/store/Rootstate'

function setActualConversations(state: MessageState, payload: Conversation[]) {
  state.actualConversations = payload
}

function setArchivedConversations(
  state: MessageState,
  payload: Conversation[]
) {
  state.archivedConversations = payload
}

function setConversation(state: MessageState, payload: Conversation) {
  state.conversation = payload
}

function setMessages(state: MessageState, messages: Message[]) {
  state.messages = messages
}

function addMessage(state: MessageState, message: Message) {
  state.messages.push(message)
}

export const buildMutations = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  return {
    setActualConversations: msBuilder.commit(setActualConversations),
    setArchivedConversations: msBuilder.commit(setArchivedConversations),
    setConversation: msBuilder.commit(setConversation),
    setMessages: msBuilder.commit(setMessages),
    addMessage: msBuilder.commit(addMessage),
  }
}
