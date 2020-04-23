export default {
  isHeaderVisible: state => state.header.visible,
  isFooterVisible: state => state.footer.visible,
  isBackButtonVisible: state => state.backButtonVisible,
  getNotificationQueue: state => state.notificationQueue,
  isNotificationBarVisible: state => state.notificationBarVisible,
  getTempValue: state => identifier => state.temp[identifier],
  getSelectedNav: state => state.footer.selectedNav,
  getUpdateMessages: state => state.updateMessages,
}
