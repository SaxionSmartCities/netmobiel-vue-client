import { UiState, UiNotification, UiUpdateMessage } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { actions, mutations } from '@/store/ui'
import constants from '@/constants/constants'

type ActionContext = BareActionContext<UiState, RootState>

function addUpdate(context: ActionContext, update: UiUpdateMessage): void {
  let updates = context.state.updateMessages
  let found = updates!.find(u => JSON.stringify(u) === JSON.stringify(update))
  if (found === undefined) {
    mutations.pushUpdate(update)
  }
}

function queueInfoNotification(context: ActionContext, payload: string) {
  queueNotification(context, {
    message: payload,
    timeout: constants.defaultNotificationTimeout,
  })
}

function queueErrorNotification(context: ActionContext, payload: string) {
  queueNotification(context, { message: payload, timeout: 0 })
}

function queueNotification(context: ActionContext, payload: UiNotification) {
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

function finishNotification(context: ActionContext) {
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

export const buildActions = (builder: ModuleBuilder<UiState, RootState>) => {
  return {
    addUpdate: builder.dispatch(addUpdate),
    queueErrorNotification: builder.dispatch(queueErrorNotification),
    queueInfoNotification: builder.dispatch(queueInfoNotification),
    finishNotification: builder.dispatch(finishNotification),
  }
}
