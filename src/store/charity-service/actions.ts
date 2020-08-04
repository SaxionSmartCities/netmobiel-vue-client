import { CharityState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import axios from 'axios'
import { mutations } from '@/store/charity-service/index'

// @ts-ignore
const chsBuilder: ModuleBuilder = getStoreBuilder().module('chs')
type ActionContext = BareActionContext<CharityState, RootState>

const BASE_URL = 'http://localhost:3000'

function fetchCharities(context: ActionContext, params: any): void {
  axios.get(BASE_URL + '/api/charity').then(resp => {
    mutations.setCharities(resp.data.charities)
  })
}

const actions = {
  fetchCharities: chsBuilder.dispatch(fetchCharities),
}

export default actions
