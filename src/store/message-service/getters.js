export default {
  getMessages: state => urn => {
    return state.messages[urn]
  },
  getConversations(state) {
    return state.conversations
  },
}
