import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios'
import config from '@/config/config'
import { Conversation, MessageState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { mutations } from './index'
import { generateHeaders } from '@/utils/Utils'
import moment from 'moment'
import * as uiStore from '@/store/ui'
import { emptyPage } from '@/store/storeHelper'

type ActionContext = BareActionContext<MessageState, RootState>

const { COMMUNICATOR_BASE_URL, GRAVITEE_COMMUNICATOR_SERVICE_API_KEY } = config

function fetchConversations(
  context: ActionContext,
  { select, conversationContext, offset, maxResults }: any
): Promise<AxiosResponse<any>> {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations`
  return axios.get(URL, {
    params: {
      context: conversationContext,
      select,
      maxResults: maxResults ?? 100,
      offset: offset ?? 0,
    },
    headers: generateHeaders(
      GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
      delegatorId
    ) as AxiosRequestHeaders,
  })
}

function fetchActualConversations(context: ActionContext, payload: any) {
  const params = { ...payload }
  params.select = 'ACTUAL'
  return fetchConversations(context, params)
    .then(function (resp) {
      if (resp.status === 200) {
        mutations.setActualConversations(resp.data)
        return resp.data
      }
      return emptyPage
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de conversaties.'
      )
      return emptyPage
    })
}

function fetchArchivedConversations(context: ActionContext, payload: any) {
  const params = { ...payload }
  params.select = 'ARCHIVED'
  return fetchConversations(context, params)
    .then(function (resp) {
      if (resp.status === 200) {
        mutations.setArchivedConversations(resp.data)
        return resp.data
      }
      return emptyPage
    })
    .catch(function (error) {
      // Omit the message as the conversations are fetched in twins
      // The new conversations listing would be in error too, probably
      // uiStore.actions.queueErrorNotification(
      //   'Fout bij het ophalen van de conversaties.'
      // )
      return emptyPage
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
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status == 200) {
        mutations.setConversation(response.data)
      }
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de conversatie.'
      )
    })
}

function fetchConversationByContext(
  context: ActionContext,
  { conversationContext }: any
) {
  const params = { conversationContext, maxResults: 1 }
  return fetchConversations(context, params)
    .then(function (resp) {
      if (resp.status === 200) {
        const pagedResultSet = resp.data
        if (pagedResultSet.totalCount === 0) {
          // no conversation found
          uiStore.actions.queueErrorNotification(
            'Geen passende conversatie gevonden.'
          )
          return null
        } else if (pagedResultSet.totalCount > 1) {
          // Too many conversations, should be just one
          // eslint-disable-next-line
          console.warn(`#${pagedResultSet.totalCount} conversations found for context ${conversationContext}`)
        }
        // Assign the single conversation. Note that in this version the set of contexts is missing.
        return pagedResultSet.data[0]
      }
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de conversatie.'
      )
      return null
    })
}
function fetchMessages(
  context: ActionContext,
  { conversationId, sortDir, maxResults, offset }: any
) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations/${conversationId}/messages`
  axios
    .get(URL, {
      params: {
        deliveryMode: 'MESSAGE',
        maxResults: maxResults ?? 100,
        sortDir,
        offset,
      },
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then(function (resp) {
      mutations.setMessages(resp.data)
    })
    .catch(function (error) {
      mutations.setMessages(emptyPage)
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de berichten.'
      )
    })
}

function sendMessage(context: ActionContext, payload: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/messages`
  return axios.post(URL, payload, {
    headers: generateHeaders(
      GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
      delegatorId
    ) as AxiosRequestHeaders,
  })
}

function fetchMessage(context: ActionContext, { id }: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/messages/${id}`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then(function (resp) {
      return Promise.resolve(resp.data)
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van het bericht.'
      )
    })
}

export const buildActions = (
  msBuilder: ModuleBuilder<MessageState, RootState>
) => {
  return {
    fetchActualConversations: msBuilder.dispatch(fetchActualConversations),
    fetchArchivedConversations: msBuilder.dispatch(fetchArchivedConversations),
    fetchConversation: msBuilder.dispatch(fetchConversation),
    fetchConversationByContext: msBuilder.dispatch(fetchConversationByContext),
    fetchMessages: msBuilder.dispatch(fetchMessages),
    fetchMessage: msBuilder.dispatch(fetchMessage),
    sendMessage: msBuilder.dispatch(sendMessage),
  }
}
