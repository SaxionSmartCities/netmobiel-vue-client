import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { RootState } from '@/store/Rootstate'
import { Charity, BankerState, Deposit, OrderId } from './types'
import axios, { AxiosRequestHeaders } from 'axios'
import moment from 'moment'
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
      return
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
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van het goede doel.'
    )
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
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van de afbeelding van het goede doel.'
    )
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
    // Expect the image path
    // Ignore the returned url. We will fetch the charity object later on.
    if (resp.status !== 204) {
      // eslint-disable-next-line
      console.warn(`updateCharityAccount: Unexpected status ${resp.status}`)
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(error)
    await uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van de financiële gegevens het goede doel.'
    )
  }
}

// ===========  DONATIONS  ================

async function donate(
  context: ActionContext,
  { id, amount, message, isAnonymous }: any
) {
  try {
    const donation = {
      amount,
      description: message,
      anonymous: isAnonymous,
    }
    const resp = await axios.post(
      `${BANKER_BASE_URL}/charities/${id}/donations`,
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
      'Fout bij het ophalen van recent gedoneerd.'
    )
  }
}

async function fetchDonationsForCharity(context: ActionContext, id: string) {
  try {
    const resp = await axios.get(
      `${BANKER_BASE_URL}/charities/${id}/donations`,
      {
        headers: generateHeaders(
          GRAVITEE_BANKER_SERVICE_API_KEY
        ) as AxiosRequestHeaders,
      }
    )
    const charities = resp.data
    const donations = charities.data.map((d: any) => ({
      donor: {
        id: d.donor?.managedIdentity,
        firstName: d.donor?.givenName,
        lastName: d.donor?.familyName,
      },
      credits: d.amount,
      message: d.description,
      isAnonymous: d.anonymous,
      published: d.donationTime,
    }))
    mutations.setCharityDonations(donations)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van het goede doel.'
    )
  }
}

async function fetchTopDonors(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/users/generosity`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    if (resp.status === 200) {
      const donors = resp.data.data.map((d: any) => ({
        totalDonated: d.donatedCredits,
        user: {
          managedIdentity: d.managedIdentity,
          firstName: d.givenName,
          lastName: d.familyName,
        },
      }))
      mutations.setTopDonors(donors)
    }
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van top donateurs.'
    )
  }
}

// ===========  WITHDRAWAL & PAYMENT BATCH  ================

async function fetchWithdrawals(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/withdrawals`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
    })
    const withdrawals = resp.data.data
    // eslint-disable-next-line
    console.log(withdrawals)
    mutations.setWithdrawals(withdrawals)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de uitbetalingen.'
    )
  }
}

async function fetchPaymentBatches(context: ActionContext) {
  try {
    const since = moment().subtract(1, 'months').format()
    const until = moment().format()
    const params = { since, until }
    const resp = await axios.get(`${BANKER_BASE_URL}/payment-batches`, {
      headers: generateHeaders(
        GRAVITEE_BANKER_SERVICE_API_KEY
      ) as AxiosRequestHeaders,
      params: params,
    })
    const batches = resp.data.data
    // eslint-disable-next-line
    console.log(batches)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de uitbetalingen.'
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

async function fetchStatements(context: ActionContext, payload: PageSelection) {
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
  if (statementsPage && statementsPage.count < statementsPage.totalCount) {
    mutations.mergeAcountStatements(
      await fetchStatements(context, {
        offset: statementsPage.count,
        maxResults,
      })
    )
  }
}

// this shouldn't be a Vuex store action, because it doesn't use state from the store
async function buyCredits(context: ActionContext, payload: Deposit) {
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
    return resp.data
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de payment URL voor de inkoop van credits.'
    )
  }
}

async function getDepositStatus(context: ActionContext, payload: OrderId) {
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
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de storting status.'
    )
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
    return resp.data
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de boekingen voor de rekeninghouder.'
    )
  }
}

export const buildActions = (
  chsBuilder: ModuleBuilder<BankerState, RootState>
) => {
  return {
    // Charities
    fetchCharities: chsBuilder.dispatch(fetchCharities),
    fetchCharity: chsBuilder.dispatch(fetchCharity),
    createCharity: chsBuilder.dispatch(createCharity),
    updateCharity: chsBuilder.dispatch(updateCharity),
    updateCharityImage: chsBuilder.dispatch(updateCharityImage),
    removeCharityImage: chsBuilder.dispatch(removeCharityImage),
    updateCharityAccount: chsBuilder.dispatch(updateCharityAccount),
    // Donations
    donate: chsBuilder.dispatch(donate),
    fetchDonationsForCharity: chsBuilder.dispatch(fetchDonationsForCharity),
    fetchTopDonors: chsBuilder.dispatch(fetchTopDonors),
    fetchPreviouslyDonatedCharities: chsBuilder.dispatch(
      fetchPreviouslyDonatedCharities
    ),
    // Withdrawals & Payment batches
    fetchWithdrawals: chsBuilder.dispatch(fetchWithdrawals),
    fetchPaymentBatches: chsBuilder.dispatch(fetchPaymentBatches),

    buyCredits: chsBuilder.dispatch(buyCredits),
    getDepositStatus: chsBuilder.dispatch(getDepositStatus),
    fetchBankerUser: chsBuilder.dispatch(fetchUser),
    fetchBankerSettings: chsBuilder.dispatch(fetchSettings),
    fetchFirstAccountStatements: chsBuilder.dispatch(fetchFirstStatements),
    fetchMoreAccountStatements: chsBuilder.dispatch(fetchMoreStatements),
    fetchSystemAccounts: chsBuilder.dispatch(fetchSystemAccounts),
  }
}
