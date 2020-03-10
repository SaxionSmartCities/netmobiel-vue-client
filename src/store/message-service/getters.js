export default {
  getMessages: state => urn => {
    return state.messages[urn]
  },
  getConversations(state) {
    return state.conversations
  },
  getConversationByContext: state => ctx => {
    return state.conversations.find(conv => conv.context === ctx)
  },
}
