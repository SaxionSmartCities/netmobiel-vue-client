import { ActionTree } from 'vuex'
import { UiState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { mutations } from '@/store/ui/index'

// @ts-ignore
const uiBuilder: ModuleBuilder = getStoreBuilder().module('ui')

type ActionContext = BareActionContext<UiState, RootState>

function addUpdate(context: ActionContext, update: any): void {
  let updates = context.state.updateMessages
  let found = updates!.find(u => JSON.stringify(u) === JSON.stringify(update))
  if (found === undefined) {
    mutations.pushUpdate('pushUpdate', update)
  }
}

function queueNotification(context: ActionContext, payload: any) {
  mutations.pushNotificationToQueue(payload)

  // If the notification that was just pushed is the first (in a while),
  // set the timeout and call finishNotification after it's done.
  if (context.state.notificationQueue!.length == 1) {
    // Explicitly show notification so we can hide and show between transitions.
    mutations.showNotificationBar()
    let currentNotification = context.state.notificationQueue![0]
    if (currentNotification.timeout > 0) {
      setTimeout(() => {
        actions.finishNotification()
      }, currentNotification.timeout)
    }
  }
}

function finishNotification(context: ActionContext, payload: any) {
  mutations.hideNotificationBar()
  mutations.removeFirstNotificationFromQueue()

  // Kick off next notification if there are others to do.
  if (context.state.notificationQueue!.length > 0) {
    // Delay showing the next notification in order for the UI
    // transitions to work properly.
    setTimeout(() => {
      mutations.showNotificationBar()
      let currentNotification = context.state.notificationQueue![0]
      if (currentNotification.timeout > 0) {
        setTimeout(() => {
          actions.finishNotification()
        }, currentNotification.timeout)
      }
    }, 250)
  }
}
const actions = {
  addUpdate: uiBuilder.dispatch(addUpdate),
  queueNotification: uiBuilder.dispatch(queueNotification),
  finishNotification: uiBuilder.dispatch(finishNotification),
}

export default actions
