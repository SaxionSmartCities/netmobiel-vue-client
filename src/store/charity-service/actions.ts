import { CharityState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import axios from 'axios'
import { mutations } from '@/store/charity-service/index'

// @ts-ignore
const chsBuilder: ModuleBuilder = getStoreBuilder().module('chs')
type ActionContext = BareActionContext<CharityState, RootState>

const BASE_URL = 'http://localhost:3000'

function fetchCharities(context: ActionContext, payload: any): void {
  const params: any = {}
  if (payload && payload.q) params['q'] = payload.q
  axios.get(BASE_URL + '/api/charity', { params: params }).then(resp => {
    console.log('charities?', resp)
    const charities = resp.data.charities
    if (!payload) {
      mutations.setCharities(charities)
    } else if (payload.store === 'previous') {
      mutations.setPreviouslyDonatedCharities(charities)
    }
  })
}

function fetchPreviouslyDonatedCharities(
  context: ActionContext,
  params: any
): void {
  axios.get(BASE_URL + '/api/donation/previous').then(resp => {
    actions.fetchCharities({ q: resp.data.charities, store: 'previous' })
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

function searchCharities(context: ActionContext, params: any): void {
  axios.get(BASE_URL + '/api/charity', { params: {} }).then(resp => {
    mutations.setCharitySearchResults(resp.data.charities)
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
  axios.post(BASE_URL + '/api/donation', data).then(resp => {
    console.log('donated succesfully?', resp.data)
  })
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

const actions = {
  fetchCharities: chsBuilder.dispatch(fetchCharities),
  lookupCharity: chsBuilder.dispatch(lookupCharity),
  searchCharities: chsBuilder.dispatch(searchCharities),
  donate: chsBuilder.dispatch(donate),
  fetchDonationsFromCharity: chsBuilder.dispatch(fetchDonationsFromCharity),
  fetchTopDonors: chsBuilder.dispatch(fetchTopDonors),
  fetchPreviouslyDonatedCharities: chsBuilder.dispatch(
    fetchPreviouslyDonatedCharities
  ),
}

export default actions
