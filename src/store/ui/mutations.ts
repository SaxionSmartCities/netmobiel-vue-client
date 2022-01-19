import { ModuleBuilder } from 'vuex-typex'
import { RootState } from '@/store/Rootstate'
import { UiState, UiNotification, UiUpdateMessage } from '@/store/ui/types'

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
  const indexOf = state.updateMessages!.indexOf(payload)
  if (indexOf > -1) {
    state.updateMessages!.splice(indexOf, 1)
  }
}
function removeUpdateById(state: UiState, id: string) {
  const indexOf = state.updateMessages!.findIndex((msg) => msg.id === id)
  if (indexOf > -1) {
    state.updateMessages!.splice(indexOf, 1)
  }
}
export const buildMutations = (builder: ModuleBuilder<UiState, RootState>) => {
  return {
    enableHeader: builder.commit(enableHeader),
    disableHeader: builder.commit(disableHeader),
    enableFooter: builder.commit(enableFooter),
    disableFooter: builder.commit(disableFooter),
    hideBackButton: builder.commit(hideBackButton),
    showBackButton: builder.commit(showBackButton),
    showNotificationBar: builder.commit(showNotificationBar),
    hideNotificationBar: builder.commit(hideNotificationBar),
    pushNotificationToQueue: builder.commit(pushNotificationToQueue),
    removeFirstNotificationFromQueue: builder.commit(
      removeFirstNotificationFromQueue
    ),
    setSelectedNav: builder.commit(setSelectedNav),
    shiftUpdateMessage: builder.commit(shiftUpdateMessage),
    pushUpdate: builder.commit(pushUpdate),
    removeUpdate: builder.commit(removeUpdate),
    removeUpdateById: builder.commit(removeUpdateById),
  }
}
