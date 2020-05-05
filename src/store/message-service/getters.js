export default {
  getMessages: state => urn => {
    return state.messages[urn]
  },
  getActiveMessages: state => {
    return state.activeMessages
  },
  getMessagesNormal: state => {
    return state.messages
  },
  getConversations(state) {
    return state.conversations
  },
  getConversationByContext: state => ctx => {
    return state.conversations.find(conv => conv.context === ctx)
  },
}
