export default {
  isHeaderVisible: state => state.header.visible,
  isFooterVisible: state => state.footer.visible,
  isBackButtonVisible: state => state.backButtonVisible,
  getNotificationQueue: state => state.notificationQueue,
  isNotificationBarVisible: state => state.notificationBarVisible,
  getAppClasses: state => state.app.classes,
  getTempValue: state => identifier => state.temp[identifier],
  getSelectedNav: state => state.footer.selectedNav,
}
