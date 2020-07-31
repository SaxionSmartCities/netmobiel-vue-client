import { UiState } from './types'
import { RootState, storeBuilder } from '@/store/Rootstate'
import { BareActionContext } from 'vuex-typex'
import uiGetters from '@/store/ui/getters'
import uiMutations from '@/store/ui/mutations'
import uiActions from '@/store/ui/actions'

export const uiBuilder = storeBuilder.module<UiState>('ui', new UiState())
export const getters = uiGetters
export const mutations = uiMutations
export const actions = uiActions

// export const getters: {
//
//   'isHeaderVisible': state => state.header.visible,
//
//   isFooterVisible: state => state.footer.visible,
//   isBackButtonVisible: state => state.backButtonVisible,
//   getNotificationQueue: state => state.notificationQueue,
//   isNotificationBarVisible: state => state.notificationBarVisible,
//   getSelectedNav: state => state.footer.selectedNav,
//   getUpdateMessages: state => state.updateMessages,
//
// }

// export default {
//   namespaced,
//   state,
//   actions,
//   getters,
//   mutations,
// }
