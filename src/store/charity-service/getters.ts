import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { CharityState } from '@/store/charity-service/types'
// @ts-ignore
const chsBuilder: ModuleBuilder = getStoreBuilder().module('chs')

const getCharities = chsBuilder.read((state: CharityState) => {
  return state.charities
}, 'getCharities')

const getCharitySearchResults = chsBuilder.read((state: CharityState) => {
  return state.charitySearchResults
}, 'getCharitySearchResults')

export default {
  get getCharities() {
    return getCharities()
  },
  get getCharitySearchResults() {
    return getCharitySearchResults()
  },
}
