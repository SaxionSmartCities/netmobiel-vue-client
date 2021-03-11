import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { RootState } from '@/store/Rootstate'
import { Charity, CharityState } from './types'
import { mutations } from '@/store/charity-service/index'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import moment from 'moment'
import util from '@/utils/Utils'
import config from '@/config/config'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<CharityState, RootState>

const { BASE_URL, GRAVITEE_BANKER_SERVICE_API_KEY } = config
const { generateHeaders } = util

async function fetchCharities(context: ActionContext, payload: any = {}) {
  try {
    const resp = await axios.get(`${BASE_URL}/banker/charities`, {
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
    const resp = await axios.get(`${BASE_URL}/banker/charities/${id}`, {
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
    const resp = await axios.post(`${BASE_URL}/banker/charities`, payload, {
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
      `${BASE_URL}/banker/charities/${id}/donations`,
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
      `${BASE_URL}/banker/users/me/recent-donations`,
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
      `${BASE_URL}/banker/charities/${id}/donations`,
      {
        headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
      }
    )
    const charities = resp.data
    const donations = charities.data.map((d: any) => ({
      sender: {
        id: d.anonymous ? uuidv4() : d.donor.id,
        firstName: d.anonymous ? 'Anoniem' : d.donor.givenName,
        lastName: d.anonymous ? '' : d.donor.familyName,
      },
      credits: d.amount,
      message: d.description,
      isAnonymous: d.anonymous,
      published: d.donationDate,
    }))
    mutations.setCharityDonations(donations)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van het goede doel.'
    )
  }
}

async function fetchTopDonors(context: ActionContext, id: string) {
  try {
    const resp = await axios.get(`${BASE_URL}/banker/users/generosity`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    if (resp.status === 200) {
      let donors = resp.data.data.map((d: any) => ({
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

async function fetchWithdrawals(context: ActionContext, payload: any = {}) {
  try {
    const resp = await axios.get(`${BASE_URL}/banker/withdrawal-requests`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    const withdrawals = resp.data.data
    console.log(withdrawals)
    mutations.setWithdrawals(withdrawals)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van de uitbetalingen.'
    )
  }
}

async function fetchPaymentBatches(context: ActionContext, payload: any = {}) {
  try {
    const since = moment()
      .subtract(1, 'months')
      .format()
    const until = moment().format()
    const params = { since, until }
    const resp = await axios.get(`${BASE_URL}/banker/payment-batches`, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
    const batches = resp.data.data
    console.log(batches)
    // mutations.setCharities(charities)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
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
