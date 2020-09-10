import { ModuleBuilder } from 'vuex-typex'
import { Page } from '../types'
import { CreditsState, User, Settings, Statement } from './types'
import { RootState } from '@/store/Rootstate'

function setUser(state: CreditsState, user: User) {
  state.user = user
}
function setSettings(state: CreditsState, settings: Settings) {
  state.settings = settings
}
function setStatements(state: CreditsState, statements: Page<Statement>) {
  state.statements = statements
}

export const buildMutations = (
  gsBuilder: ModuleBuilder<CreditsState, RootState>
) => {
  return {
    setBankerUser: gsBuilder.commit(setUser),
    setBankerSettings: gsBuilder.commit(setSettings),
    setAccountStatements: gsBuilder.commit(setStatements),
  }
}
