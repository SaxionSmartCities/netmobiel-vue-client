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
  setTempValue: (state, payload) => {
    Object.keys(payload)
      .filter(key => payload.hasOwnProperty(key))
      .forEach(key => {
        state.temp[key] = payload[key]
      })
  },
  addAppClass: (state, payload) => {
    state.app.classes.push(payload)
  },
  removeAppClass: (state, payload) => {
    state.app.classes = state.app.classes.filter(x => x !== payload)
  },
  clearAppClasses: state => {
    state.app.classes = []
  },
  setSelectedNav: (state, payload) => {
    state.footer.selectedNav = payload
  },
  shiftUpdateMessage: state => {
    state.updateMessages.shift()
  },
  pushUpdate: (state, payload) => {
    state.updateMessages.push(payload)
  },
  removeUpdate: (state, update) => {
    let indexOf = state.updateMessages.indexOf(update)
    state.updateMessages.splice(indexOf, 1)
  },
}
