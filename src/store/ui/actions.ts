import { ActionTree } from 'vuex'
import { UiState } from './types'
import { RootState } from '@/store/Rootstate'

export const actions: ActionTree<UiState, RootState> = {
  queueNotification: (context, payload) => {
    context.commit('pushNotificationToQueue', payload)

    // If the notification that was just pushed is the first (in a while),
    // set the timeout and call finishNotification after it's done.
    if (context.state.notificationQueue.length == 1) {
      // Explicitly show notification so we can hide and show between transitions.
      context.commit('showNotificationBar')
      let currentNotification = context.state.notificationQueue[0]
      if (currentNotification.timeout > 0) {
        setTimeout(() => {
          context.dispatch('finishNotification')
        }, currentNotification.timeout)
      }
    }
  },
  finishNotification: context => {
    context.commit('hideNotificationBar')
    context.commit('removeFirstNotificationFromQueue')

    // Kick off next notification if there are others to do.
    if (context.state.notificationQueue.length > 0) {
      // Delay showing the next notification in order for the UI
      // transitions to work properly.
      setTimeout(() => {
        context.commit('showNotificationBar')
        let currentNotification = context.state.notificationQueue[0]
        if (currentNotification.timeout > 0) {
          setTimeout(() => {
            context.dispatch('finishNotification')
          }, currentNotification.timeout)
        }
      }, 250)
    }
  },
  addUpdate: (context, update) => {
    let updates = context.state.updateMessages
    let found = updates.find(u => JSON.stringify(u) === JSON.stringify(update))
    if (found === undefined) {
      context.commit('pushUpdate', update)
    }
  },
}
