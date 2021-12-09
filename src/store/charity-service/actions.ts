import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { RootState } from '@/store/Rootstate'
import { CharityState } from './types'
import { mutations } from '@/store/charity-service/index'
import axios from 'axios'
import config from '@/config/config'
import * as uiStore from '@/store/ui'
import { generateHeaders } from '@/utils/Utils'

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

async function saveCharity(context: ActionContext, payload: any) {
  try {
    const resp = await axios.post(`${BANKER_BASE_URL}/charities`, payload, {
      headers: generateHeaders(GRAVITEE_BANKER_SERVICE_API_KEY),
    })
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van het goede doel.'
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

async function fetchTopDonors(context: ActionContext, id: string) {
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

export const buildActions = (
  chsBuilder: ModuleBuilder<CharityState, RootState>
) => {
  return {
    fetchCharities: chsBuilder.dispatch(fetchCharities),
    fetchCharity: chsBuilder.dispatch(fetchCharity),
    saveCharity: chsBuilder.dispatch(saveCharity),
    donate: chsBuilder.dispatch(donate),
    fetchDonationsForCharity: chsBuilder.dispatch(fetchDonationsForCharity),
    fetchTopDonors: chsBuilder.dispatch(fetchTopDonors),
    fetchPreviouslyDonatedCharities: chsBuilder.dispatch(
      fetchPreviouslyDonatedCharities
    ),
  }
}
