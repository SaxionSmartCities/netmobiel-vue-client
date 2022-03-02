import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { RootState } from '@/store/Rootstate'
import { Charity, CharityState } from './types'
import { mutations } from '@/store/charity-service/index'
import axios from 'axios'
import moment from 'moment'
import { generateHeaders } from '@/utils/Utils'
import config from '@/config/config'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<CharityState, RootState>

const { BANKER_BASE_URL, GRAVITEE_BANKER_SERVICE_API_KEY } = config

async function fetchCharities(context: ActionContext, payload: any = {}) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/charities`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    const charities = resp.data.data
    mutations.setCharities(charities)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de goede doelen.'
    )
  }
}

async function fetchCharity(context: ActionContext, id: string) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/charities/${id}`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    const charities = resp.data
    mutations.setCharity(charities)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van het goede doel.'
    )
  }
}

async function saveCharity(context: ActionContext, payload: Charity) {
  try {
    const resp = await axios.post(`${BANKER_BASE_URL}/charities`, payload, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het opslaan van het goede doel.'
    )
  }
}

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
        headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
      }
    )
  } catch (problem) {
    uiStore.actions.queueErrorNotification('Fout bij het opslaan van donatie.')
  }
}

async function fetchPreviouslyDonatedCharities(context: ActionContext) {
  try {
    const resp = await axios.get(
      `${BANKER_BASE_URL}/users/me/recent-donations`,
      {
        headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
      }
    )
    const donations = resp.data
    const charities = donations.data.map((d: any) => d.charity)
    mutations.setPreviouslyDonatedCharities(charities)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van recent gedoneerd.'
    )
  }
}

async function fetchDonationsForCharity(context: ActionContext, id: string) {
  try {
    const resp = await axios.get(
      `${BANKER_BASE_URL}/charities/${id}/donations`,
      {
        headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
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
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van het goede doel.'
    )
  }
}

async function fetchTopDonors(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/users/generosity`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
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
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van top donateurs.'
    )
  }
}

async function fetchWithdrawals(context: ActionContext) {
  try {
    const resp = await axios.get(`${BANKER_BASE_URL}/withdrawals`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    const withdrawals = resp.data.data
    // console.log(withdrawals)
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
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
      params: params,
    })
    const batches = resp.data.data
    // console.log(batches)
  } catch (problem) {
    await uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de uitbetalingen.'
    )
  }
}

export const buildActions = (
  chsBuilder: ModuleBuilder<CharityState, RootState>
) => {
  return {
    fetchCharities: chsBuilder.dispatch(fetchCharities),
    fetchCharity: chsBuilder.dispatch(fetchCharity),
    saveCharity: chsBuilder.dispatch(saveCharity),
    fetchWithdrawals: chsBuilder.dispatch(fetchWithdrawals),
    fetchPaymentBatches: chsBuilder.dispatch(fetchPaymentBatches),
    donate: chsBuilder.dispatch(donate),
    fetchDonationsForCharity: chsBuilder.dispatch(fetchDonationsForCharity),
    fetchTopDonors: chsBuilder.dispatch(fetchTopDonors),
    fetchPreviouslyDonatedCharities: chsBuilder.dispatch(
      fetchPreviouslyDonatedCharities
    ),
  }
}
