import { UiState } from './types'
import { RootState, storeBuilder } from '@/store/Rootstate'
import { BareActionContext } from 'vuex-typex'
import uiGetters from '@/store/ui/getters'
import uiMutations from '@/store/ui/mutations'

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

export const uiBuilder = storeBuilder.module<UiState>('ui', new UiState())
export const getters = uiGetters
export const mutations = uiMutations

// actions
type ActionContext = BareActionContext<UiState, RootState>

async function fakeAction(context: ActionContext, payload: boolean) {
  const res = await fakeUserLoginService(payload)
  console.log('result is ', res, payload)
  if (res) {
    mutations.setBackButtonVisible(res)
  }
}

export const actions = {
  fakeAction: uiBuilder.dispatch(fakeAction),
}

// fake async call
async function fakeUserLoginService(bool: boolean): Promise<boolean | null> {
  return bool
}
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
