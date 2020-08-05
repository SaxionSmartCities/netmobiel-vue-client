import { CharityState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import axios from 'axios'
import { mutations } from '@/store/charity-service/index'

// @ts-ignore
const chsBuilder: ModuleBuilder = getStoreBuilder().module('chs')
type ActionContext = BareActionContext<CharityState, RootState>

const BASE_URL = 'http://localhost:3000'

function fetchCharities(context: ActionContext, params: any): void {
  axios.get(BASE_URL + '/api/charity').then(resp => {
    mutations.setCharities(resp.data.charities)
  })
}

function lookupCharity(context: ActionContext, id: string): void {
  axios
    .get(BASE_URL + '/api/charity', {
      params: {
        id,
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
  { id, amount, message, isAnonymouse, sender }: any
): void {
  const data = {
    sender,
    id,
    message,
    amount,
    isAnonymouse,
  }
  console.log('pushing this data', data)
  // axios.post(BASE_URL + '/api/donation', data).then(resp => {
  //   console.log('donated succesfully?', resp.data)
  // })
}

const actions = {
  fetchCharities: chsBuilder.dispatch(fetchCharities),
  lookupCharity: chsBuilder.dispatch(lookupCharity),
  searchCharities: chsBuilder.dispatch(searchCharities),
  donate: chsBuilder.dispatch(donate),
}

export default actions
