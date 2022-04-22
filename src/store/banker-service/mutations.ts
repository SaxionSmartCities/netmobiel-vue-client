import { ModuleBuilder } from 'vuex-typex'
import {
  Account,
  BankerState,
  Charity,
  Donation,
  PaymentBatch,
  Reward,
  Settings,
  Statement,
  User,
  Withdrawal,
} from '@/store/banker-service/types'
import { RootState } from '@/store/Rootstate'
import { Page } from '@/store/types'
import { assignPageResults } from '@/store/storeHelper'

function setCharities(state: BankerState, charities: Page<Charity>) {
  state.charities = assignPageResults(state.charities, charities)
}

function setPopularCharities(state: BankerState, charities: Page<Charity>) {
  state.popularCharities = assignPageResults(state.popularCharities, charities)
}

function setCharitySearchResults(state: BankerState, charities: Page<Charity>) {
  state.charitySearchResults = assignPageResults(
    state.charitySearchResults,
    charities
  )
}

function setCharity(state: BankerState, payload: Charity) {
  state.charity = payload
}

function setCharityDonations(state: BankerState, donations: Page<Donation>) {
  state.charityDonations = assignPageResults(state.charityDonations, donations)
}

function setTopDonors(state: BankerState, donors: Page<User>) {
  state.topDonors = assignPageResults(state.topDonors, donors)
}

function setPreviouslyDonatedCharities(
  state: BankerState,
  charities: Page<Charity>
) {
  state.previouslyDonatedCharities = assignPageResults(
    state.previouslyDonatedCharities,
    charities
  )
}

function setWithdrawals(state: BankerState, withdrawals: Page<Withdrawal>) {
  state.withdrawals = assignPageResults(state.withdrawals, withdrawals)
}

function setPaymentBatches(
  state: BankerState,
  paymentBatches: Page<PaymentBatch>
) {
  state.paymentBatches = assignPageResults(state.paymentBatches, paymentBatches)
}

function setPaymentBatch(state: BankerState, payload: PaymentBatch) {
  state.paymentBatch = payload
}

function setUser(state: BankerState, user: User) {
  state.user = user
}
function setSettings(state: BankerState, settings: Settings) {
  state.settings = settings
}
function setStatements(state: BankerState, statements: Page<Statement>) {
  state.statements = assignPageResults(state.statements, statements)
}

function setSystemAccounts(state: BankerState, accounts: Page<Account>) {
  state.systemAccounts = assignPageResults(state.systemAccounts, accounts)
}

function setRewards(state: BankerState, rewards: Page<Reward>) {
  state.rewards = assignPageResults(state.rewards, rewards)
}

export const buildMutations = (
  bsBuilder: ModuleBuilder<BankerState, RootState>
) => {
  return {
    setWithdrawals: bsBuilder.commit(setWithdrawals),
    setPaymentBatches: bsBuilder.commit(setPaymentBatches),
    setPaymentBatch: bsBuilder.commit(setPaymentBatch),
    setCharities: bsBuilder.commit(setCharities),
    setPopularCharities: bsBuilder.commit(setPopularCharities),
    setCharity: bsBuilder.commit(setCharity),
    setCharitySearchResults: bsBuilder.commit(setCharitySearchResults),
    setCharityDonations: bsBuilder.commit(setCharityDonations),
    setTopDonors: bsBuilder.commit(setTopDonors),
    setPreviouslyDonatedCharities: bsBuilder.commit(
      setPreviouslyDonatedCharities
    ),
    setBankerUser: bsBuilder.commit(setUser),
    setBankerSettings: bsBuilder.commit(setSettings),
    setAccountStatements: bsBuilder.commit(setStatements),
    setSystemAccounts: bsBuilder.commit(setSystemAccounts),
    setRewards: bsBuilder.commit(setRewards),
  }
}
