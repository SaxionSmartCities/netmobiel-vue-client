import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { RootState } from '@/store/Rootstate'
import {
  Account,
  BankerState,
  Charity,
  Deposit,
  Donation,
  PaymentBatch,
  PaymentEvent,
  Withdrawal,
} from './types'
import axios, { AxiosError, AxiosRequestHeaders } from 'axios'
import { generateHeaders } from '@/utils/Utils'
import config from '@/config/config'
import * as uiStore from '@/store/ui'
import { PageSelection } from '@/store/types'
import { getters } from '@/store/banker-service'
import { mutations } from '@/store/banker-service/index'

type ActionContext = BareActionContext<BankerState, RootState>

const { BANKER_BASE_URL, IMAGES_BASE_URL, GRAVITEE_BANKER_SERVICE_API_KEY } =
  config

function createAbsoluteImageUrl(imagePath: string | null | undefined): string {
  return imagePath ? `${IMAGES_BASE_URL}/${imagePath}` : ''
}

// ===========  CHARITIES  ================

async function fetchCharities(context: ActionContext, payload: any = {}) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/charities`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: payload,
    })
    const charities = resp.data.data
    charities.forEach((c: Charity) => {
      c.imageUrl = createAbsoluteImageUrl(c.imageUrl)
    })
    mutations.setCharities(charities)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de goede doelen.'
    )
  }
}

async function fetchCharity(context: ActionContext, id: string) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/charities/${id}`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    const charity = resp.data
    charity.imageUrl = createAbsoluteImageUrl(charity.imageUrl)
    mutations.setCharity(charity)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van het goede doel.'
    )
  }
}

async function createCharity(context: ActionContext, payload: Charity) {
  try {
    const resp = await axios.post(`${BANKER_BASE_URL}/charities`, payload, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    // Expect a 201
    if (resp.status !== 201) {
      // eslint-disable-next-line
      console.warn(`createCharity: Unexpected status ${resp.status}`)
    } else {
      return resp.headers.location
    }
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het aanmaken van het goede doel.'
    )
  }
}

async function updateCharity(context: ActionContext, charity: Charity) {
  const URL = `${BANKER_BASE_URL}/charities/${charity.id}`
  try {
    const resp = await axios.put(URL, charity, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    // Expect a 204
    if (resp.status !== 204) {
      // eslint-disable-next-line
      console.warn(`updateCharity: Unexpected status ${resp.status}`)
    }
    return true
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van het goede doel.'
    )
    return false
  }
}

async function updateCharityImage(context: ActionContext, { id, image }: any) {
  const URL = `${BANKER_BASE_URL}/charities/${id}/image`
  try {
    const resp = await axios.put(
      URL,
      { image },
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    // Expect the image path
    // Ignore the returned url. We will fetch the charity object later on.
    if (resp.status !== 200) {
      // eslint-disable-next-line
      console.warn(`updateCharityImage: Unexpected status ${resp.status}`)
    }
    return true
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van de afbeelding van het goede doel.'
    )
    return false
  }
}

async function removeCharityImage(context: ActionContext, id: string) {
  const URL = `${BANKER_BASE_URL}/charities/${id}/image`
  try {
    const resp = await axios.delete(URL, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    if (resp.status !== 204) {
      // eslint-disable-next-line
      console.warn(`removeCharityImage: Unexpected status ${resp.status}`)
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het verwijderen van de afbeelding van het goede doel.'
    )
  }
}

async function updateCharityAccount(
  context: ActionContext,
  { id, account }: any
) {
  const URL = `${BANKER_BASE_URL}/charities/${id}/account`
  try {
    const resp = await axios.put(URL, account, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    if (resp.status !== 204) {
      // eslint-disable-next-line
      console.warn(`updateCharityAccount: Unexpected status ${resp.status}`)
    }
    return true
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van de financiële gegevens van het goede doel.'
    )
    return false
  }
}

// ===========  DONATIONS  ================

async function fetchPopularCharities(context: ActionContext, payload: any) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/charities/popularity`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: {
        charity: payload?.charity,
        offset: payload?.offset,
        maxResults: payload?.maxResults,
      },
    })
    if (resp.status === 200) {
      mutations.setPopularCharities(resp.data.data)
    }
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de populariteit van goede doelen.'
    )
  }
}

async function donate(context: ActionContext, donation: Donation) {
  try {
    const resp = await axios.post(
      `${BANKER_BASE_URL}/charities/${donation.charityRef}/donations`,
      donation,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    // Expect a Created status
    if (resp.status !== 201) {
      // eslint-disable-next-line
      console.warn(`donate: Unexpected status ${resp.status}`)
    }
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van donatie.'
    )
  }
}

async function fetchPreviouslyDonatedCharities(context: ActionContext) {
  try {
    const resp = await axios.get(
      `${BANKER_BASE_URL}/users/me/recent-donations`,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
        params: {
          maxResults: 5,
        },
      }
    )
    const donations = resp.data
    const charities = donations.data.map((d: any) => d.charity)
    charities.forEach((c: Charity) => {
      c.imageUrl = createAbsoluteImageUrl(c.imageUrl)
    })
    mutations.setPreviouslyDonatedCharities(charities)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van recent gedoneerde goede doelen.'
    )
  }
}

async function fetchDonationsForCharity(context: ActionContext, payload: any) {
  try {
    const resp = await axios.get(
      `${BANKER_BASE_URL}/charities/${payload.charityId}/donations`,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
        params: {
          offset: payload.offset,
          maxResults: payload.maxResults,
          user: payload.userId,
        },
      }
    )
    mutations.setCharityDonations(resp.data.data)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de donaties voor het goede doel.'
    )
  }
}

async function fetchTopDonors(context: ActionContext, payload: any) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/users/generosity`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: {
        charity: payload?.charity,
        offset: payload?.offset,
        maxResults: payload?.maxResults,
      },
    })
    if (resp.status === 200) {
      mutations.setTopDonors(resp.data.data)
    }
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van top donateurs.'
    )
  }
}

async function fetchSettings(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/settings`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    mutations.setBankerSettings(resp.data)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de bankier instellingen.'
    )
  }
}

async function fetchUser(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/users/me`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    mutations.setBankerUser(resp.data)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de rekeninghouder.'
    )
  }
}

async function fetchUserStatements(
  context: ActionContext,
  payload: PageSelection
) {
  const offset = payload?.offset ?? 0,
    maxResults = payload?.maxResults ?? 10
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/users/me/statements`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: {
        offset,
        maxResults,
      },
    })
    return resp.data
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de boekingen voor de rekeninghouder.'
    )
  }
}

async function fetchFirstUserStatements(
  context: ActionContext,
  maxResults: number
) {
  mutations.setAccountStatements(
    await fetchUserStatements(context, { offset: 0, maxResults })
  )
}

async function fetchMoreUserStatements(
  context: ActionContext,
  maxResults: number
) {
  const statementsPage = getters.getAccountStatements
  if (statementsPage && statementsPage.count < statementsPage.totalCount) {
    mutations.mergeAcountStatements(
      await fetchUserStatements(context, {
        offset: statementsPage.count,
        maxResults,
      })
    )
  }
}

async function depositCreditsToMyAccount(
  context: ActionContext,
  payload: Deposit
) {
  try {
    const resp = await axios.post(
      `${BANKER_BASE_URL}/users/me/deposits`,
      payload,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    // Returns the url to redirect to for doing the actual deposit
    return resp.data
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de payment URL voor de inkoop van credits.'
    )
  }
}

async function withdrawCreditsFromMyAccount(
  context: ActionContext,
  payload: Withdrawal
) {
  try {
    const resp = await axios.post(
      `${BANKER_BASE_URL}/users/me/withdrawals`,
      payload,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    if (resp.status !== 201) {
      // eslint-disable-next-line
      console.warn(`withdrawCreditsFromMyAccount: Unexpected status ${resp.status}`)
    }
    return true
  } catch (problem: unknown) {
    let msg = 'Fout bij het plaatsen van een verzoek om credits in te wisselen.'
    const error = problem as Error | AxiosError
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        msg = 'Je hebt onvoldoende saldo voor dit aantal credits'
      }
    }
    await uiStore.actions.queueErrorNotification(msg)
    return false
  }
}

async function fetchUserRewards(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/users/me/rewards`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: {
        maxResults: 20,
      },
    })
    mutations.setRewards(resp.data)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de beloningen.'
    )
  }
}

async function updatePersonalAccount(context: ActionContext, account: Account) {
  const URL = `${BANKER_BASE_URL}/users/me/account`
  try {
    const resp = await axios.put(URL, account, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    if (resp.status !== 204) {
      // eslint-disable-next-line
      console.warn(`updatePersonalAccount: Unexpected status ${resp.status}`)
    }
    return true
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van de financiële gegevens.'
    )
    return false
  }
}

async function getDepositStatus(context: ActionContext, payload: PaymentEvent) {
  try {
    const resp = await axios.post(
      `${BANKER_BASE_URL}/deposit-events`,
      payload,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    return resp.data
    // return Promise.resolve({ status: 'Active' })
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de status van de storting.'
    )
  }
}

// ===========  ACCOUNTS   ================

async function fetchStatements(context: ActionContext, payload: any = {}) {
  const params = { ...payload }
  delete params.accountId
  try {
    const resp = await axios.get(
      `${BANKER_BASE_URL}/accounts/${payload.accountId}/statements`,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
        params,
      }
    )
    return resp.data
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de boekingen voor de rekeninghouder.'
    )
  }
}

async function fetchFirstStatements(context: ActionContext, payload: any) {
  const firstSet = await fetchStatements(context, payload)
  mutations.setAccountStatements(firstSet)
}

async function fetchMoreStatements(context: ActionContext, payload: any) {
  const statementsPage = getters.getAccountStatements
  if (statementsPage && statementsPage.count < statementsPage.totalCount) {
    const nextSet = await fetchStatements(context, {
      offset: statementsPage.count,
      maxResults: payload.maxResults,
    })
    if (nextSet) {
      mutations.mergeAcountStatements(nextSet)
    }
  }
}

async function fetchSystemAccounts(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/accounts`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: {
        purpose: 'SYSTEM',
      },
    })
    mutations.setSystemAccounts(resp.data)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de systeemrekening.'
    )
  }
}

async function depositCredits(context: ActionContext, payload: Deposit) {
  try {
    const resp = await axios.post(
      `${BANKER_BASE_URL}/accounts/${payload.accountId}/deposits`,
      payload,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    if (resp.status !== 201) {
      // eslint-disable-next-line
      console.warn(`depositCredits: Unexpected status ${resp.status}`)
    }
    return resp.headers.location
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophogen van de credits.'
    )
    return null
  }
}

async function withdrawCredits(context: ActionContext, payload: Withdrawal) {
  try {
    const resp = await axios.post(
      `${BANKER_BASE_URL}/accounts/${payload.accountId}/withdrawals`,
      payload,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    if (resp.status !== 201) {
      // eslint-disable-next-line
      console.warn(`withdrawCredits: Unexpected status ${resp.status}`)
    }
    return resp.headers.location
  } catch (problem) {
    let msg = 'Fout bij het verlagen van de credits.'
    const error = problem as Error | AxiosError
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        msg = 'Onvoldoende saldo voor dit aantal credits'
      }
    }
    await uiStore.actions.queueErrorNotification(msg)
    return null
  }
}

async function updateAccount(context: ActionContext, account: Account) {
  const URL = `${BANKER_BASE_URL}/accounts/${account.id}`
  try {
    const resp = await axios.put(URL, account, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    if (resp.status !== 204) {
      // eslint-disable-next-line
      console.warn(`updateAccount: Unexpected status ${resp.status}`)
    }
    return true
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van de financiële gegevens.'
    )
    return false
  }
}

// ===========  WITHDRAWAL & PAYMENT BATCH  ================

async function fetchUserWithdrawals(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/users/me/withdrawals`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    const withdrawals = resp.data
    mutations.setWithdrawals(withdrawals)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de opnames.'
    )
  }
}

async function cancelUserWithdrawal(context: ActionContext, wrid: string) {
  try {
    const resp = await axios.delete(
      `${BANKER_BASE_URL}/users/me/withdrawals/${wrid}`,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    if (resp.status !== 204) {
      // eslint-disable-next-line
      console.warn(`cancelUserWithdrawal: Unexpected status ${resp.status}`)
    }
    return true
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het annuleren van de opname.'
    )
    return false
  }
}

async function fetchWithdrawalsPage(context: ActionContext, params: any) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/withdrawals`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: { ...params },
    })
    return resp.data
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de uitbetalingen.'
    )
    return null
  }
}

async function fetchWithdrawalsRequestedCount(context: ActionContext) {
  const page = await fetchWithdrawalsPage(context, {
    status: 'REQUESTED',
    maxResults: 0,
  })
  return page?.totalCount
}

async function fetchWithdrawals(context: ActionContext, params: any) {
  const withdrawals = await fetchWithdrawalsPage(context, params)
  mutations.setWithdrawals(withdrawals)
}

async function fetchPaymentBatches(context: ActionContext, params: any) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/payment-batches`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: { ...params },
    })
    mutations.setPaymentBatches(resp.data)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de uitbetalingen.'
    )
  }
}

async function fetchPaymentBatchByFormat(context: ActionContext, payload: any) {
  try {
    const resp = await axios.get(
      `${BANKER_BASE_URL}/payment-batches/${payload.batchId}`,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
        params: { format: payload.format },
      }
    )
    return resp.data
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de uitbetalingsbatch.'
    )
    return null
  }
}

async function createPaymentBatch(context: ActionContext) {
  try {
    const resp = await axios.post(`${BANKER_BASE_URL}/payment-batches`, null, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    // Expect a 201
    if (resp.status !== 201) {
      // eslint-disable-next-line
      console.warn(`createPaymentBatch: Unexpected status ${resp.status}`)
    } else {
      return resp.headers.location
    }
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het maken van een nieuwe uitbetalingsbatch.'
    )
  }
}

async function fetchPaymentBatch(context: ActionContext, batchId: any) {
  const batch = await fetchPaymentBatchByFormat(context, {
    batchId,
    format: 'JSON',
  })
  mutations.setPaymentBatch(batch)
}

async function downloadPaymentBatchFile(context: ActionContext, batchId: any) {
  return await fetchPaymentBatchByFormat(context, {
    batchId,
    format: 'PAIN.001',
  })
}

async function updatePaymentBatch(
  context: ActionContext,
  paymentBatch: PaymentBatch
) {
  try {
    const resp = await axios.put(
      `${BANKER_BASE_URL}/payment-batches/${paymentBatch.id}`,
      paymentBatch,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    return resp.data
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de uitbetalingsbatch.'
    )
    return null
  }
}

async function mailMePaymentBatchCreditTransferXML(
  context: ActionContext,
  paymentBatchId: String
) {
  try {
    const resp = await axios.post(
      `${BANKER_BASE_URL}/payment-batches/${paymentBatchId}/mail-pain`,
      null,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
        params: {
          pendingOnly: true,
        },
      }
    )
    return true
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het mailen van de uitbetalingsbatch.'
    )
    return false
  }
}

export const buildActions = (
  bsBuilder: ModuleBuilder<BankerState, RootState>
) => {
  return {
    // Charities
    fetchCharities: bsBuilder.dispatch(fetchCharities),
    fetchCharity: bsBuilder.dispatch(fetchCharity),
    createCharity: bsBuilder.dispatch(createCharity),
    updateCharity: bsBuilder.dispatch(updateCharity),
    updateCharityImage: bsBuilder.dispatch(updateCharityImage),
    removeCharityImage: bsBuilder.dispatch(removeCharityImage),
    updateCharityAccount: bsBuilder.dispatch(updateCharityAccount),

    // Donations
    donate: bsBuilder.dispatch(donate),
    fetchDonationsForCharity: bsBuilder.dispatch(fetchDonationsForCharity),
    fetchTopDonors: bsBuilder.dispatch(fetchTopDonors),
    fetchPopularCharities: bsBuilder.dispatch(fetchPopularCharities),

    // Users
    depositCreditsToMyAccount: bsBuilder.dispatch(depositCreditsToMyAccount),
    withdrawCreditsFromMyAccount: bsBuilder.dispatch(
      withdrawCreditsFromMyAccount
    ),
    fetchUserWithdrawals: bsBuilder.dispatch(fetchUserWithdrawals),
    cancelUserWithdrawal: bsBuilder.dispatch(cancelUserWithdrawal),
    fetchBankerUser: bsBuilder.dispatch(fetchUser),
    fetchBankerSettings: bsBuilder.dispatch(fetchSettings),
    fetchFirstUserStatements: bsBuilder.dispatch(fetchFirstUserStatements),
    fetchMoreUserStatements: bsBuilder.dispatch(fetchMoreUserStatements),
    fetchPreviouslyDonatedCharities: bsBuilder.dispatch(
      fetchPreviouslyDonatedCharities
    ),
    fetchUserRewards: bsBuilder.dispatch(fetchUserRewards),
    updatePersonalAccount: bsBuilder.dispatch(updatePersonalAccount),

    // Accounts
    fetchFirstStatements: bsBuilder.dispatch(fetchFirstStatements),
    fetchMoreStatements: bsBuilder.dispatch(fetchMoreStatements),
    fetchSystemAccounts: bsBuilder.dispatch(fetchSystemAccounts),
    depositCredits: bsBuilder.dispatch(depositCredits),
    withdrawCredits: bsBuilder.dispatch(withdrawCredits),
    updateAccount: bsBuilder.dispatch(updateAccount),

    // Check deposits
    getDepositStatus: bsBuilder.dispatch(getDepositStatus),

    // Withdrawals & Payment batches
    fetchWithdrawalsRequestedCount: bsBuilder.dispatch(
      fetchWithdrawalsRequestedCount
    ),
    fetchWithdrawals: bsBuilder.dispatch(fetchWithdrawals),
    fetchPaymentBatches: bsBuilder.dispatch(fetchPaymentBatches),
    fetchPaymentBatch: bsBuilder.dispatch(fetchPaymentBatch),
    createPaymentBatch: bsBuilder.dispatch(createPaymentBatch),
    downloadPaymentBatchFile: bsBuilder.dispatch(downloadPaymentBatchFile),
    updatePaymentBatch: bsBuilder.dispatch(updatePaymentBatch),
    mailMePaymentBatchCreditTransferXML: bsBuilder.dispatch(
      mailMePaymentBatchCreditTransferXML
    ),
  }
}
