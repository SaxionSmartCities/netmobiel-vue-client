import { ModuleBuilder } from 'vuex-typex'
import { CreditsState } from './types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  gsBuilder: ModuleBuilder<CreditsState, RootState>
) => {
  const getExchangeRate = gsBuilder.read((state: CreditsState) => {
    return state.exchangeRate
  }, 'getExchangeRate')

  return {
    get getExchnageRate() {
      return getExchangeRate()
    },
  }
}
