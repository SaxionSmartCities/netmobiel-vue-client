import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { UiState } from '@/store/ui/types'
// @ts-ignore
const uiBuilder: ModuleBuilder = getStoreBuilder().module('ui')

const isHeaderVisible = uiBuilder.read((state: UiState) => {
  return state.header!.visible
}, 'isHeaderVisible')

const isFooterVisible = uiBuilder.read((state: UiState) => {
  return state.footer!.visible
}, 'isFooterVisible')

const isBackButtonVisible = uiBuilder.read((state: UiState) => {
  return state.backButtonVisible
}, 'isBackButtonVisible')

const getNotificationQueue = uiBuilder.read((state: UiState) => {
  return state.notificationQueue
}, 'getNotificationQueue')

const isNotificationBarVisible = uiBuilder.read((state: UiState) => {
  return state.notificationBarVisible
}, 'isNotificationBarVisible')

const getSelectedNav = uiBuilder.read((state: UiState) => {
  return state.footer!.selectedNav
}, 'getSelectedNav')

const getUpdateMessages = uiBuilder.read((state: UiState) => {
  return state.updateMessages
}, 'getUpdateMessages')

export default {
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
    console.log('getting the updatemssages')
    return getUpdateMessages()
  },
}
