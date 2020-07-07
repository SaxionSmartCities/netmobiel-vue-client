import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { UiState } from './types'

export const state: UiState = {
  header: {
    visible: true,
  },
  footer: {
    visible: true,
    selectedNav: 'home',
  },
  backButtonVisible: false,
  notificationBarVisible: false,
  notificationQueue: [],
  updateMessages: [],
}

const namespaced: boolean = true

export default {
  namespaced,
  state,
  actions,
  getters,
  mutations,
}
