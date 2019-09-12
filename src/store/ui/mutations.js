export default {
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
  pushNotificationToQueue: (state, payload) => {
    state.notificationQueue.push(payload)
  },
  removeFirstNotificationFromQueue: state => {
    state.notificationQueue = state.notificationQueue.slice(1)
  },
}
