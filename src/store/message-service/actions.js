import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL
const GRAVITEE_COMMUNICATOR_SERVICE_API_KEY =
  config.GRAVITEE_COMMUNICATOR_SERVICE_API_KEY

function generateHeaders(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  fetchMessages: ({ commit }) => {
    const URL = BASE_URL + `/communicator/messages`
    axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_COMMUNICATOR_SERVICE_API_KEY),
      })
      .then(function(resp) {
        commit('setMessages', resp.data)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchConversations: async ({ commit }) => {
    const URL = BASE_URL + `/communicator/messages`
    return await axios
      .get(URL, {
        params: {
          groupByConversation: true,
        },
        headers: generateHeaders(GRAVITEE_COMMUNICATOR_SERVICE_API_KEY),
      })
      .then(function(resp) {
        if (resp.status === 200) {
          resp.data.data.forEach(item => {
            item.participants = [
              item.sender,
              ...item.envelopes.map(envelope => envelope.recipient),
            ]
          })
          commit('setConversations', resp.data.data)
          return resp.data.data
        }
        return []
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  fetchMessagesByParams: ({ commit }, { context, participant }) => {
    const URL = BASE_URL + `/communicator/messages`
    return axios
      .get(URL, {
        params: {
          context: context,
          participant,
        },
        headers: generateHeaders(GRAVITEE_COMMUNICATOR_SERVICE_API_KEY),
      })
      .then(function(resp) {
        context = context.replace(/:/gi, '')
        commit('setMessages', { context: context, messages: resp.data.data })
        commit('addContext', context)
        return resp.data.data
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  sendMessage: async ({ commit }, payload) => {
    const URL = BASE_URL + `/communicator/messages`
    return await axios
      .post(URL, payload, {
        headers: generateHeaders(GRAVITEE_COMMUNICATOR_SERVICE_API_KEY),
      })
      .then(function(resp) {
        if (resp.status === 202) {
          const message = {
            sender: { managedIdentity: payload.managedIdentity },
            body: payload.body,
            context: payload.context,
            creationTime: new Date(),
            deliveryMode: payload.deliveryMode,
          }
          commit('addActiveMessage', message)
          return message
        }
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
