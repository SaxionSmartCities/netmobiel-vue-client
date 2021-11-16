import axios, { AxiosResponse } from 'axios'
import config from '@/config/config'
import { Conversation, MessageState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { mutations } from './index'
import { generateHeaders } from '@/utils/Utils'
import moment from 'moment'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<MessageState, RootState>

const { COMMUNICATOR_BASE_URL, GRAVITEE_COMMUNICATOR_SERVICE_API_KEY } = config

function fetchConversations(
  context: ActionContext,
  select: string
): Promise<AxiosResponse<any>> {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations`
  return axios.get(URL, {
    params: {
      select: select,
      maxResults: 100,
    },
    headers: generateHeaders(
      GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
      delegatorId
    ),
  })
}

function fetchActualConversations(context: ActionContext) {
  return fetchConversations(context, 'ACTUAL')
    .then(function(resp) {
      if (resp.status === 200) {
        mutations.setActualConversations(resp.data.data)
        return resp.data.data
      }
      return []
    })
    .catch(function(error) {
      // TODO: Proper error handling.
      // eslint-disable-next-line
      console.log(error)
      return []
    })
}

function fetchArchivedConversations(context: ActionContext) {
  return fetchConversations(context, 'ARCHIVED')
    .then(function(resp) {
      if (resp.status === 200) {
        mutations.setArchivedConversations(resp.data.data)
        return resp.data.data
      }
      return []
    })
    .catch(function(error) {
      // TODO: Proper error handling.
      // eslint-disable-next-line
      console.log(error)
      return []
    })
}

function fetchConversation(context: ActionContext, { id }: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations/${id}`
  axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ),
    })
    .then(response => {
      if (response.status == 200) {
        mutations.setConversation(response.data)
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de conversatie.'
      )
    })
}

function fetchMessages(
  context: ActionContext,
  { id, maxResults, offset }: any
) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations/${id}/messages`
  axios
    .get(URL, {
      params: {
        deliveryMode: 'MESSAGE',
        maxResults: maxResults || 100,
        offset: offset,
      },
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ),
    })
    .then(function(resp) {
      mutations.setMessages(resp.data.data)
    })
    .catch(function(error) {
      mutations.setMessages([])
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de meldingen.'
      )
      // eslint-disable-next-line
      console.log(error)
    })
}

async function sendMessage(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/messages`
  return await axios
    .post(URL, payload, {
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ),
    })
    .then(function(resp) {
      if (resp.status === 200) {
        // Update the list without actually refreshing the list
        const message = {
          ...payload,
          sender: { managedIdentity: payload.managedIdentity },
          createdTime: moment().toISOString(),
        }
        mutations.addMessage(message)
        return message
      }
    })
    .catch(function(error) {
      // TODO: Proper error handling.
      // eslint-disable-next-line
      console.log(error)
    })
}

export const buildActions = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  return {
    fetchActualConversations: msBuilder.dispatch(fetchActualConversations),
    fetchArchivedConversations: msBuilder.dispatch(fetchArchivedConversations),
    fetchConversation: msBuilder.dispatch(fetchConversation),
    fetchMessages: msBuilder.dispatch(fetchMessages),
    sendMessage: msBuilder.dispatch(sendMessage),
  }
}
