import { ModuleBuilder } from 'vuex-typex'
import { BankerState } from '@/store/banker-service/types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  bsBuilder: ModuleBuilder<BankerState, RootState>
) => {
  const getCharities = bsBuilder.read((state) => {
    return state.charities
  }, 'getCharities')

  const getCharitySearchResults = bsBuilder.read((state) => {
    return state.charitySearchResults
  }, 'getCharitySearchResults')

  const getSelectedCharity = bsBuilder.read((state) => {
    return state.charity
  }, 'getSelectedCharity')

  const getSelectedCharityDonations = bsBuilder.read((state) => {
    return state.charityDonations
  }, 'getSelectedCharityDonations')

  const getPreviouslyDonatedCharities = bsBuilder.read((state) => {
    return state.previouslyDonatedCharities
  }, 'getPreviouslyDonatedCharities')

  const getTopDonors = bsBuilder.read((state) => {
    return state.topDonors
  }, 'getTopDonors')

  const getWithdrawals = bsBuilder.read((state) => {
    return state.withdrawals
  }, 'getWithdrawals')

  const getUser = bsBuilder.read((state) => {
    return state.user
  }, 'getUser')
  const getSettings = bsBuilder.read((state) => {
    return state.settings
  }, 'getSettings')
  const getStatements = bsBuilder.read((state) => {
    return state.statements
  }, 'getStatements')
  const getSystemAccounts = bsBuilder.read((state) => {
    return state.systemAccounts
  }, 'getSystemAccounts')
  return {
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
    get getWithdrawals() {
      return getWithdrawals()
    },
    get getBankerUser() {
      return getUser()
    },
    get getBankerSettings() {
      return getSettings()
    },
    get getAccountStatements() {
      return getStatements()
    },
    get getSystemAccounts() {
      return getSystemAccounts()
    },
  }
}
