import axios from 'axios'
import config from '@/config/config'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { getters, mutations } from '@/store/credits-service'
import { CreditsState, Deposit, OrderId, Statement } from './types'
import { Page, PageSelection } from '../types'
import { RootState } from '@/store/Rootstate'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<CreditsState, RootState>

const { BASE_URL, GRAVITEE_BANKER_SERVICE_API_KEY } = config

function generateHeaders(key: any) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

async function fetchSettings(context: ActionContext) {
  try {
    const resp = await axios.get(`${BASE_URL}/banker/settings`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    mutations.setBankerSettings(resp.data)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de bankier instellingen.'
    )
  }
}

async function fetchUser(context: ActionContext) {
  try {
    const resp = await axios.get(`${BASE_URL}/banker/users/me`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    mutations.setBankerUser(resp.data)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de rekeninghouder.'
    )
  }
}

async function fetchStatements(context: ActionContext, payload: PageSelection) {
  const offset = payload?.offset ?? 0,
    maxResults = payload?.maxResults ?? 10
  try {
    const resp = await axios.get(
      `${BASE_URL}/banker/users/me/statements?offset=${offset}&maxResults=${maxResults}`,
      {
        headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
      }
    )
    return resp.data
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de boekingen voor de rekeninghouder.'
    )
  }
}

async function fetchFirstStatements(
  context: ActionContext,
  maxResults: number
) {
  mutations.setAccountStatements(
    await fetchStatements(context, { offset: 0, maxResults })
  )
}

async function fetchMoreStatements(context: ActionContext, maxResults: number) {
  const statementsPage = getters.getAccountStatements
  if (statementsPage.count < statementsPage.totalCount) {
    mutations.mergeAcountStatements(
      await fetchStatements(context, {
        offset: statementsPage.count,
        maxResults,
      })
    )
  }
}

async function fetchBankerUser() {
  try {
    const resp = await axios.get(`${BASE_URL}/banker/users/me`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    console.log(resp)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de wisselkoers.'
    )
  }
}

// this shouldn't be a Vuex store action, because it doesn't use state from the store
async function buyCredits(context: ActionContext, payload: Deposit) {
  try {
    const resp = await axios.post(
      `${BASE_URL}/banker/users/me/deposits`,
      payload,
      {
        headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
      }
    )
    return resp.data
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de payment URL voor de inkoop van credits.'
    )
  }
}

async function getDepositStatus(context: ActionContext, payload: OrderId) {
  try {
    await fetchBankerUser()
    const resp = await axios.post(
      `${BASE_URL}/banker/deposit-events`,
      payload,
      {
        headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
      }
    )
    return resp.data
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de storting status.'
    )
  }
}

export const buildActions = (
  gsBuilder: ModuleBuilder<CreditsState, RootState>
) => {
  return {
    buyCredits: gsBuilder.dispatch(buyCredits),
    getDepositStatus: gsBuilder.dispatch(getDepositStatus),
    fetchBankerUser: gsBuilder.dispatch(fetchUser),
    fetchBankerSettings: gsBuilder.dispatch(fetchSettings),
    fetchFirstAccountStatements: gsBuilder.dispatch(fetchFirstStatements),
    fetchMoreAccountStatements: gsBuilder.dispatch(fetchMoreStatements),
  }
}
