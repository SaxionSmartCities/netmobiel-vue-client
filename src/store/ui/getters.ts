import { GetterTree } from 'vuex'
import { UiState } from './types'
import { RootState } from '../'

export const getters: GetterTree<UiState, RootState> = {
  isHeaderVisible: state => state.header.visible,
  isFooterVisible: state => state.footer.visible,
  isBackButtonVisible: state => state.backButtonVisible,
  getNotificationQueue: state => state.notificationQueue,
  isNotificationBarVisible: state => state.notificationBarVisible,
  getSelectedNav: state => state.footer.selectedNav,
  getUpdateMessages: state => state.updateMessages,
}
