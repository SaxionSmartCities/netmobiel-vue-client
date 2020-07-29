import { UiState, UiNotification, UiUpdateMessage } from '@/store/ui/types'
import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
// @ts-ignore
const uiBuilder: ModuleBuilder = getStoreBuilder().module('ui')

function enableHeader(state: UiState) {
  state.header!.visible = true
}
function disableHeader(state: UiState) {
  state.header!.visible = false
}
function enableFooter(state: UiState) {
  state.footer!.visible = true
}
function disableFooter(state: UiState) {
  state.footer!.visible = false
}
function hideBackButton(state: UiState) {
  state.backButtonVisible = false
}
function showBackButton(state: UiState) {
  state.backButtonVisible = true
}
function showNotificationBar(state: UiState) {
  state.notificationBarVisible = true
}
function hideNotificationBar(state: UiState) {
  state.notificationBarVisible = false
}
function pushNotificationToQueue(state: UiState, payload: UiNotification) {
  state.notificationQueue!.push(payload)
}
function removeFirstNotificationFromQueue(state: UiState) {
  state.notificationQueue = state.notificationQueue!.slice(1)
}
function setSelectedNav(state: UiState, payload: string) {
  state.footer!.selectedNav = payload
}
function shiftUpdateMessage(state: UiState) {
  state.updateMessages!.shift()
}
function pushUpdate(state: UiState, payload: UiUpdateMessage) {
  state.updateMessages!.push(payload)
}
function removeUpdate(state: UiState, payload: UiUpdateMessage) {
  let indexOf = state.updateMessages!.indexOf(payload)
  state.updateMessages!.splice(indexOf, 1)
}

export default {
  enableHeader: uiBuilder.commit(enableHeader),
  disableHeader: uiBuilder.commit(disableHeader),
  enableFooter: uiBuilder.commit(enableFooter),
  disableFooter: uiBuilder.commit(disableFooter),
  hideBackButton: uiBuilder.commit(hideBackButton),
  showBackButton: uiBuilder.commit(showBackButton),
  showNotificationBar: uiBuilder.commit(showNotificationBar),
  hideNotificationBar: uiBuilder.commit(hideNotificationBar),
  pushNotificationToQueue: uiBuilder.commit(pushNotificationToQueue),
  removeFirstNotificationFromQueue: uiBuilder.commit(
    removeFirstNotificationFromQueue
  ),
  setSelectedNav: uiBuilder.commit(setSelectedNav),
  shiftUpdateMessage: uiBuilder.commit(shiftUpdateMessage),
  pushUpdate: uiBuilder.commit(pushUpdate),
  removeUpdate: uiBuilder.commit(removeUpdate),
}

// export const mutations: MutationTree<UiState> = {
//   enableHeader: state => {
//     state.header.visible = true
//   },
//   disableHeader: state => {
//     state.header.visible = false
//   },
//   enableFooter: state => {
//     state.footer.visible = true
//   },
//   disableFooter: state => {
//     state.footer.visible = false
//   },
//   hideBackButton: state => {
//     state.backButtonVisible = false
//   },
//   showBackButton: state => {
//     state.backButtonVisible = true
//   },
//   showNotificationBar: state => {
//     state.notificationBarVisible = true
//   },
//   hideNotificationBar: state => {
//     state.notificationBarVisible = false
//   },
//   pushNotificationToQueue: (state, payload: UiNotification) => {
//     state.notificationQueue.push(payload)
//   },
//   removeFirstNotificationFromQueue: state => {
//     state.notificationQueue = state.notificationQueue.slice(1)
//   },
//   setSelectedNav: (state, payload: string) => {
//     state.footer.selectedNav = payload
//   },
//   shiftUpdateMessage: state => {
//     state.updateMessages.shift()
//   },
//   pushUpdate: (state, payload: UiUpdateMessage) => {
//     state.updateMessages.push(payload)
//   },
//   removeUpdate: (state, payload: UiUpdateMessage) => {
//     let indexOf = state.updateMessages.indexOf(payload)
//     state.updateMessages.splice(indexOf, 1)
//   },
// }
