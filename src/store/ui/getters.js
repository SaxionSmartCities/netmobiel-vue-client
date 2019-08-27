export default {
  isHeaderVisible: state => {
    return state.ui.header.visible
  },
  isFooterVisible: state => {
    return state.ui.footer.visible
  },
  isBackButtonVisible: state => {
    return state.ui.backButtonVisible
  },
}
