import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios'
import config from '@/config/config'
import { Conversation, Message, MessageState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { mutations } from './index'
import { generateHeaders } from '@/utils/Utils'
import moment from 'moment'
import * as uiStore from '@/store/ui'
import { emptyPage } from '@/store/storeHelper'

type ActionContext = BareActionContext<MessageState, RootState>

const { COMMUNICATOR_BASE_URL, GRAVITEE_COMMUNICATOR_SERVICE_API_KEY } = config

function fetchConversationsForInbox(
  context: ActionContext,
  { select, owner, offset, maxResults }: any
): Promise<AxiosResponse<any>> {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations/inbox`
  return axios.get(URL, {
    params: {
      owner,
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

function fetchActualConversations(
  context: ActionContext,
  { offset, maxResults }: any
) {
  const params = { offset, maxResults, select: 'ACTUAL', owner: 'me' }
  return fetchConversationsForInbox(context, params)
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

function fetchArchivedConversations(
  context: ActionContext,
  { offset, maxResults }: any
) {
  const params = { offset, maxResults, select: 'ARCHIVED', owner: 'me' }
  return fetchConversationsForInbox(context, params)
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

function acknowledgeConversation(context: ActionContext, conversationId: any) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations/${conversationId}/ack`
  axios
    .put(URL, null, {
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      if (response.status !== 204) {
        // eslint-disable-next-line
        console.warn(`acknowledgeConversation: Unexpected status ${response.status}`)
      }
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        'Fout bij het bevestigen van de berichten in de conversatie.'
      )
    })
}

function fetchConversationByContext(
  context: ActionContext,
  { conversationContext }: any
) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations`
  return axios
    .get(URL, {
      params: {
        context: conversationContext,
        owner: 'me',
        maxResults: 1,
        offset: 0,
      },
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((response) => {
      const pagedResultSet = response.data
      if (pagedResultSet.totalCount > 1) {
        // Too many conversations, should be just one
        // eslint-disable-next-line
        console.warn(`#${pagedResultSet.totalCount} conversations found for context ${conversationContext}`)
      }
      // Assign the single conversation.
      return pagedResultSet
    })
    .catch((error) => {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de conversatie.'
      )
      return null
    })
}

function startConversation(context: ActionContext, conversation: Conversation) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/conversations`
  // Owner is the calling (effective) user
  return axios
    .post(URL, conversation, {
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then((resp) => {
      if (resp.status !== 201) {
        // eslint-disable-next-line
        console.warn(`startConversation: Unexpected status ${resp.status}`)
      }
      return resp.headers.location
    })
    .catch((problem) => {
      uiStore.actions.queueErrorNotification(
        'Fout bij het aanmaken van het goede doel.'
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

function sendMessage(context: ActionContext, payload: Message) {
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
      return resp.data
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van het bericht.'
      )
    })
}

function fetchMyStatus(context: ActionContext) {
  const delegatorId = context.rootState.ps.user.delegatorId
  const URL = `${COMMUNICATOR_BASE_URL}/users/me`
  return axios
    .get(URL, {
      headers: generateHeaders(
        GRAVITEE_COMMUNICATOR_SERVICE_API_KEY,
        delegatorId
      ) as AxiosRequestHeaders,
    })
    .then(function (resp) {
      mutations.setUser(resp.data)
    })
    .catch(function (error) {
      uiStore.actions.queueErrorNotification(
        'Fout bij het ophalen van de status.'
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
    acknowledgeConversation: msBuilder.dispatch(acknowledgeConversation),
    startConversation: msBuilder.dispatch(startConversation),
    fetchConversationByContext: msBuilder.dispatch(fetchConversationByContext),
    fetchMessages: msBuilder.dispatch(fetchMessages),
    fetchMessage: msBuilder.dispatch(fetchMessage),
    sendMessage: msBuilder.dispatch(sendMessage),
    fetchMyStatus: msBuilder.dispatch(fetchMyStatus),
  }
}
