import { CharityState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, getStoreBuilder, ModuleBuilder } from 'vuex-typex'

// @ts-ignore
const chsBuilder: ModuleBuilder = getStoreBuilder().module('chs')

type ActionContext = BareActionContext<CharityState, RootState>

function fetchCharities(context: ActionContext, params: any): void {
  console.log('fetching charities')
}

const actions = {
  fetchCharities: chsBuilder.dispatch(fetchCharities),
}

export default actions
