import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { Charity, CharityState } from '@/store/charity-service/types'
// @ts-ignore
const chsBuilder: ModuleBuilder = getStoreBuilder().module('chs')

function setCharities(state: CharityState, payload: Charity[]) {
  state.charities = payload
}

function setCharitySearchResults(state: CharityState, payload: Charity[]) {
  state.charitySearchResults = payload
}

function setCharity(state: CharityState, payload: Charity) {
  state.charity = payload
}

export default {
  setCharities: chsBuilder.commit(setCharities),
  setCharity: chsBuilder.commit(setCharity),
  setCharitySearchResults: chsBuilder.commit(setCharitySearchResults),
}
