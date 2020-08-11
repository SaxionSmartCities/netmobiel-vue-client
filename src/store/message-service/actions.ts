import axios from 'axios'
import config from '@/config/config'
import { MessageState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { mutations } from './index'

// @ts-ignore
const msBuilder: ModuleBuilder = getStoreBuilder().module('ms')

type ActionContext = BareActionContext<MessageState, RootState>

const BASE_URL = config.BASE_URL
const GRAVITEE_COMMUNICATOR_SERVICE_API_KEY =
  config.GRAVITEE_COMMUNICATOR_SERVICE_API_KEY

function generateHeaders(key: any) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

function fetchMessages(context: ActionContext) {
  const URL = BASE_URL + `/communicator/messages`
  axios
    .get(URL, {
      headers: generateHeaders(GRAVITEE_COMMUNICATOR_SERVICE_API_KEY),
    })
    .then(function(resp) {
      mutations.setMessages(resp.data)
    })
    .catch(function(error) {
      // TODO: Proper error handling.
      // eslint-disable-next-line
      console.log(error)
    })
}

async function fetchConversations(context: ActionContext) {
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
        resp.data.data.forEach((item: any) => {
          item.participants = [
            item.sender,
            ...item.envelopes.map((envelope: any) => envelope.recipient),
          ]
        })
        mutations.setConversations(resp.data.data)
        return resp.data.data
      }
      return []
    })
    .catch(function(error) {
      // TODO: Proper error handling.
      // eslint-disable-next-line
      console.log(error)
    })
}

function fetchMessagesByParams(
  actionContext: ActionContext,
  { context, participant }: any
) {
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
      mutations.setMessages({ context: context, messages: resp.data.data })
      mutations.addContext(context)
      return resp.data.data
    })
    .catch(function(error) {
      // TODO: Proper error handling.
      // eslint-disable-next-line
      console.log(error)
    })
}

async function sendMessage(context: ActionContext, payload: any) {
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
        mutations.addActiveMessage(message)
        return message
      }
    })
    .catch(function(error) {
      // TODO: Proper error handling.
      // eslint-disable-next-line
      console.log(error)
    })
}

const actions = {
  fetchMessages: msBuilder.dispatch(fetchMessages),
  fetchConversations: msBuilder.dispatch(fetchConversations),
  fetchMessagesByParams: msBuilder.dispatch(fetchMessagesByParams),
  sendMessage: msBuilder.dispatch(sendMessage),
}

export default actions