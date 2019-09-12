export default {
  isHeaderVisible: state => state.header.visible,
  isFooterVisible: state => state.footer.visible,
  isBackButtonVisible: state => state.backButtonVisible,
  getNotificationQueue: state => state.notificationQueue,
  isNotificationBarVisible: state => state.notificationBarVisible,
}
