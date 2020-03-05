export default {
  setMessages: (state, { context, messages }) => {
    state.messages[context] = messages
  },
  setConversations: (state, payload) => {
    state.conversations = payload
  },
  addContext: (state, context) => {
    state.contexts.findIndex(id => id === context) !== -1 &&
      state.contexts.push(context)
  },
}
