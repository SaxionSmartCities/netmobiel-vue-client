import { ModuleBuilder } from 'vuex-typex'
import { CreditsState } from './types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  gsBuilder: ModuleBuilder<CreditsState, RootState>
) => {
  const getUser = gsBuilder.read((state) => {
    return state.user
  }, 'getUser')
  const getSettings = gsBuilder.read((state) => {
    return state.settings
  }, 'getSettings')
  const getStatements = gsBuilder.read((state) => {
    return state.statements
  }, 'getStatements')

  return {
    get getBankerUser() {
      return getUser()
    },
    get getBankerSettings() {
      return getSettings()
    },
    get getAccountStatements() {
      return getStatements()
    },
  }
}
