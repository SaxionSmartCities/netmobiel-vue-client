import Vue from 'vue'

export default {
  setMessages: (state, { context, messages }) => {
    state.messages[context] = messages
    state.activeMessages = messages
  },
  setConversations: (state, payload) => {
    state.conversations = payload
  },
  addContext: (state, context) => {
    state.contexts.findIndex(id => id === context) !== -1 &&
      state.contexts.push(context)
  },
  addActiveMessage: (state, message) => {
    state.activeMessages.push(message)
  },
  addMessageToContext: (state, { context, message }) => {
    // console.log('addin the context: ', context)
    // console.log('adding this message: ', message)
    const urn = (' ' + context.replace(/:/gi, '')).slice(1)
    const newMessage = {
      body: message,
      context: context,
      creationTime: new Date(),
      deliveryMode: 'MESSAGE',
    }
    Vue.set(state.messages, urn, [...state.messages[urn], newMessage])
  },
}
