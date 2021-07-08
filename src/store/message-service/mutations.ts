import Vue from 'vue'
import { ModuleBuilder } from 'vuex-typex'
import { Conversation, Message, MessageState } from './types'
import { RootState } from '@/store/Rootstate'

function setMessages(
  state: MessageState,
  { context, messages }: { context: string; messages: Message[] }
) {
  if (!state.messages.has(context)) {
    state.messages.set(context, [])
  }
  for (let message of messages) {
    state.messages.get(context)!.push(message)
  }
  state.activeMessages = messages
}

function setConversations(state: MessageState, payload: Conversation[]) {
  state.conversations = payload
}

function addContext(state: MessageState, context: string) {
  state.contexts.findIndex(id => id === context) !== -1 &&
    state.contexts.push(context)
}

function addActiveMessage(state: MessageState, message: Message) {
  state.activeMessages.push(message)
}

export const buildMutations = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  return {
    setMessages: msBuilder.commit(setMessages),
    setConversations: msBuilder.commit(setConversations),
    addContext: msBuilder.commit(addContext),
    addActiveMessage: msBuilder.commit(addActiveMessage),
  }
}
