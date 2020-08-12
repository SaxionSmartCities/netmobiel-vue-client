import { ModuleBuilder } from 'vuex-typex'
import { UiState } from '@/store/ui/types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (builder: ModuleBuilder<UiState, RootState>) => {
  const isHeaderVisible = builder.read((state: UiState) => {
    return state.header!.visible
  }, 'isHeaderVisible')

  const isFooterVisible = builder.read((state: UiState) => {
    return state.footer!.visible
  }, 'isFooterVisible')

  const isBackButtonVisible = builder.read((state: UiState) => {
    return state.backButtonVisible
  }, 'isBackButtonVisible')

  const getNotificationQueue = builder.read((state: UiState) => {
    return state.notificationQueue
  }, 'getNotificationQueue')

  const isNotificationBarVisible = builder.read((state: UiState) => {
    return state.notificationBarVisible
  }, 'isNotificationBarVisible')

  const getSelectedNav = builder.read((state: UiState) => {
    return state.footer!.selectedNav
  }, 'getSelectedNav')

  const getUpdateMessages = builder.read((state: UiState) => {
    return state.updateMessages
  }, 'getUpdateMessages')

  return {
    get isHeaderVisible() {
      return isHeaderVisible()
    },
    get isFooterVisible() {
      return isFooterVisible()
    },
    get isBackButtonVisible() {
      return isBackButtonVisible()
    },
    get getNotificationQueue() {
      return getNotificationQueue()
    },
    get isNotificationBarVisible() {
      return isNotificationBarVisible()
    },
    get getSelectedNav() {
      return getSelectedNav()
    },
    get getUpdateMessages() {
      return getUpdateMessages()
    },
  }
}
