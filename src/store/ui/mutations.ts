import { MutationTree } from 'vuex'
import { UiState, UiNotification, UiUpdateMessage } from './types'

export const mutations: MutationTree<UiState> = {
  enableHeader: state => {
    state.header.visible = true
  },
  disableHeader: state => {
    state.header.visible = false
  },
  enableFooter: state => {
    state.footer.visible = true
  },
  disableFooter: state => {
    state.footer.visible = false
  },
  hideBackButton: state => {
    state.backButtonVisible = false
  },
  showBackButton: state => {
    state.backButtonVisible = true
  },
  showNotificationBar: state => {
    state.notificationBarVisible = true
  },
  hideNotificationBar: state => {
    state.notificationBarVisible = false
  },
  pushNotificationToQueue: (state, payload: UiNotification) => {
    state.notificationQueue.push(payload)
  },
  removeFirstNotificationFromQueue: state => {
    state.notificationQueue = state.notificationQueue.slice(1)
  },
  setSelectedNav: (state, payload: string) => {
    state.footer.selectedNav = payload
  },
  shiftUpdateMessage: state => {
    state.updateMessages.shift()
  },
  pushUpdate: (state, payload: UiUpdateMessage) => {
    state.updateMessages.push(payload)
  },
  removeUpdate: (state, payload: UiUpdateMessage) => {
    let indexOf = state.updateMessages.indexOf(payload)
    state.updateMessages.splice(indexOf, 1)
  },
}
