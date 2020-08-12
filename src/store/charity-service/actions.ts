import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { Charity, CharityState, STORE_STATE_OPTIONS } from './types'
import { RootState } from '@/store/Rootstate'
import { mutations } from '@/store/charity-service/index'
import axios from 'axios'
import config from '@/config/config'

type ActionContext = BareActionContext<CharityState, RootState>

const BASE_URL = config.BASE_URL

/**
 * @param context
 * @param payload
 * @param payload.q = being sent to the backend to query on id(s).
 * q can be a single id, an array of id's. (id = managed identity) or nothing.
 * @params payload.store = the place to store the result of the response
 */
function fetchCharities(context: ActionContext, payload: any = {}): void {
  const params: any = {}
  if (payload.q) params['q'] = payload.q
  axios.get(BASE_URL + '/api/charity', { params: params }).then(resp => {
    const charities = resp.data.charities
    switch (payload.store) {
      case STORE_STATE_OPTIONS.INIT:
        mutations.setCharities(charities)
        break
      case STORE_STATE_OPTIONS.PREVIOUS:
        mutations.setPreviouslyDonatedCharities(charities)
        break
      case STORE_STATE_OPTIONS.SEARCH:
        //Is not used anywhere...
        mutations.setCharitySearchResults(charities)
        break
      default:
        mutations.setCharities(charities)
    }
  })
}

function fetchPreviouslyDonatedCharities(
  context: ActionContext,
  params: any
): void {
  axios.get(BASE_URL + '/api/donation/previous').then(resp => {
    fetchCharities(context, {
      q: resp.data.charities,
      store: STORE_STATE_OPTIONS.PREVIOUS,
    })
  })
}

function lookupCharity(context: ActionContext, id: string): void {
  axios
    .get(BASE_URL + '/api/charity', {
      params: {
        q: id,
      },
    })
    .then(resp => {
      mutations.setCharity(resp.data.charities[0])
    })
}

function donate(
  context: ActionContext,
  { id, amount, message, isAnonymous, sender }: any
): void {
  const data = {
    sender,
    message,
    charityId: id,
    credits: amount,
    isAnonymous,
  }
  axios.post(BASE_URL + '/api/donation', data).then(resp => {})
}

function fetchDonationsFromCharity(context: ActionContext, id: string): void {
  axios.get(BASE_URL + '/api/donation', { params: { id } }).then(resp => {
    mutations.setCharityDonations(resp.data.donations)
  })
}

function fetchTopDonors(context: ActionContext, id: string): void {
  axios.get(BASE_URL + '/api/donation/top', { params: { id } }).then(resp => {
    mutations.setTopDonors(resp.data.donors)
  })
}

export const buildActions = (
  chsBuilder: ModuleBuilder<CharityState, RootState>
) => {
  return {
    fetchCharities: chsBuilder.dispatch(fetchCharities),
    lookupCharity: chsBuilder.dispatch(lookupCharity),
    donate: chsBuilder.dispatch(donate),
    fetchDonationsFromCharity: chsBuilder.dispatch(fetchDonationsFromCharity),
    fetchTopDonors: chsBuilder.dispatch(fetchTopDonors),
    fetchPreviouslyDonatedCharities: chsBuilder.dispatch(
      fetchPreviouslyDonatedCharities
    ),
  }
}
