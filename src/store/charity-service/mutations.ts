import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { Charity, CharityState } from '@/store/charity-service/types'
// @ts-ignore
const chsBuilder: ModuleBuilder = getStoreBuilder().module('chs')

function setCharities(state: CharityState, payload: Charity[]) {
  state.charities = payload
}

export default {
  setCharities: chsBuilder.commit(setCharities),
}
