import { ModuleBuilder } from 'vuex-typex'
import {
  Account,
  Charity,
  BankerState,
  Donation,
  Donor,
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

function setCharitySearchResults(state: BankerState, payload: Charity[]) {
  state.charitySearchResults = payload
}

function setCharity(state: BankerState, payload: Charity) {
  state.charity = payload
}

function setCharityDonations(state: BankerState, donations: Donation[]) {
  state.charityDonations = donations
}
function setTopDonors(state: BankerState, donors: Donor[]) {
  state.topDonors = donors
}

function setPreviouslyDonatedCharities(
  state: BankerState,
  charities: Charity[]
) {
  state.previouslyDonatedCharities = charities
}

function setWithdrawals(state: BankerState, withdrawals: Withdrawal[]) {
  state.withdrawals = withdrawals
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

export const buildMutations = (
  bsBuilder: ModuleBuilder<BankerState, RootState>
) => {
  return {
    setWithdrawals: bsBuilder.commit(setWithdrawals),
    setCharities: bsBuilder.commit(setCharities),
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
  }
}
