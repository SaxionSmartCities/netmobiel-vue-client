import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { CharityState } from '@/store/charity-service/types'
// @ts-ignore
const chsBuilder: ModuleBuilder = getStoreBuilder().module('chs')

const getCharities = chsBuilder.read((state: CharityState) => {
  return state.charities
}, 'getCharities')

export default {
  get getCharities() {
    return getCharities()
  },
}
