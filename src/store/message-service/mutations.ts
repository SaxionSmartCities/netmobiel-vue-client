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
  state.messages.get(context)!.push(messages)
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

function addMessageToContext(state: MessageState, { context, message }: any) {
  const urn: string = (' ' + context.replace(/:/gi, '')).slice(1)
  const newMessage = {
    body: message,
    context: context,
    creationTime: new Date(),
    deliveryMode: 'MESSAGE',
  }
  // @ts-ignore
  Vue.set(state.messages, urn, [...state.messages[urn], newMessage])
}

export const buildMutations = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  return {
    setMessages: msBuilder.commit(setMessages),
    setConversations: msBuilder.commit(setConversations),
    addContext: msBuilder.commit(addContext),
    addActiveMessage: msBuilder.commit(addActiveMessage),
    addMessageToContext: msBuilder.commit(addMessageToContext),
  }
}
