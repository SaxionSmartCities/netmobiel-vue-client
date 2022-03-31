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

function setCharities(state: BankerState, payload: Charity[]) {
  state.charities = payload
}

function setPopularCharities(state: BankerState, payload: Charity[]) {
  state.popularCharities = payload
}

function setCharitySearchResults(state: BankerState, payload: Charity[]) {
  state.charitySearchResults = payload
}

function setCharity(state: BankerState, payload: Charity) {
  state.charity = payload
}

function setCharityDonations(state: BankerState, donations: Donation[]) {
  state.charityDonations = donations
}
function setTopDonors(state: BankerState, donors: User[]) {
  state.topDonors = donors
}

function setPreviouslyDonatedCharities(
  state: BankerState,
  charities: Charity[]
) {
  state.previouslyDonatedCharities = charities
}

function setWithdrawals(state: BankerState, withdrawals: Page<Withdrawal>) {
  state.withdrawals = withdrawals
}

function setPaymentBatches(
  state: BankerState,
  paymentBatches: Page<PaymentBatch>
) {
  state.paymentBatches = paymentBatches
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
  state.statements = statements
}
function mergeStatements(state: BankerState, statements: Page<Statement>) {
  const old = state.statements
  if (old?.count === statements.offset) {
    state.statements = {
      totalCount: statements.totalCount,
      offset: old.offset,
      count: old.count + statements.count,
      data: [...old.data, ...statements.data],
    }
  }
}
function setSystemAccounts(state: BankerState, accounts: Page<Account>) {
  state.systemAccounts = accounts
}

function setRewards(state: BankerState, rewards: Page<Reward>) {
  state.rewards = rewards
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
    mergeAcountStatements: bsBuilder.commit(mergeStatements),
    setSystemAccounts: bsBuilder.commit(setSystemAccounts),
    setRewards: bsBuilder.commit(setRewards),
  }
}
