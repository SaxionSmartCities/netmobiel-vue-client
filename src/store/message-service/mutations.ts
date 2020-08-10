import Vue from 'vue'
import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { MessageState } from './types'
// @ts-ignore
const msBuilder: ModuleBuilder = getStoreBuilder().module('ms')

function setMessages(state: MessageState, { context, messages }: any) {
  state.messages[context] = messages
  state.activeMessages = messages
}

function setConversations(state: MessageState, payload: any) {
  state.conversations = payload
}

function addContext(state: MessageState, context: any) {
  state.contexts.findIndex(id => id === context) !== -1 &&
    state.contexts.push(context)
}

function addActiveMessage(state: MessageState, message: any) {
  state.activeMessages.push(message)
}

function addMessageToContext(state: MessageState, { context, message }: any) {
  const urn = (' ' + context.replace(/:/gi, '')).slice(1)
  const newMessage = {
    body: message,
    context: context,
    creationTime: new Date(),
    deliveryMode: 'MESSAGE',
  }
  Vue.set(state.messages, urn, [...state.messages[urn], newMessage])
}

export default {
  setMessages: msBuilder.commit(setMessages),
  setConversations: msBuilder.commit(setConversations),
  addContext: msBuilder.commit(addContext),
  addActiveMessage: msBuilder.commit(addActiveMessage),
  addMessageToContext: msBuilder.commit(addMessageToContext),
}
