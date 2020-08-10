import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import {
  Charity,
  CharityState,
  Donation,
  Donor,
} from '@/store/charity-service/types'
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

function setCharityDonations(state: CharityState, donations: Donation[]) {
  state.charityDonations = donations
}
function setTopDonors(state: CharityState, donors: Donor[]) {
  state.topDonors = donors
}

function addCharityDonations(state: CharityState, donations: Donation[]) {
  state.charityDonations = state.charityDonations.concat(donations)
}

function setPreviouslyDonatedCharities(
  state: CharityState,
  charities: Charity[]
) {
  state.previouslyDonatedCharities = charities
}

