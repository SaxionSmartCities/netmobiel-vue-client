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

const getSelectedCharity = chsBuilder.read((state: CharityState) => {
  return state.charity
}, 'getSelectedCharity')

const getSelectedCharityDonations = chsBuilder.read((state: CharityState) => {
  return state.charityDonations
}, 'getSelectedCharityDonations')

const getPreviouslyDonatedCharities = chsBuilder.read((state: CharityState) => {
  return state.previouslyDonatedCharities
}, 'getPreviouslyDonatedCharities')

const getTopDonors = chsBuilder.read((state: CharityState) => {
  return state.topDonors
}, 'getTopDonors')

export default {
  get getCharities() {
    return getCharities()
  },
  get getCharitySearchResults() {
    return getCharitySearchResults()
  },
  get getSelectedCharity() {
    return getSelectedCharity()
  },
  get getSelectedCharityDonations() {
    return getSelectedCharityDonations()
  },
  get getPreviouslyDonatedCharities() {
    return getPreviouslyDonatedCharities()
  },
  get getTopDonors() {
    return getTopDonors()
  },
}