export default {
  enableHeader: state => {
    state.ui.header.visible = true
  },
  disableHeader: state => {
    state.ui.header.visible = false
  },
  enableFooter: state => {
    state.ui.footer.visible = true
  },
  disableFooter: state => {
    state.ui.footer.visible = false
  },
  //   incrementRegistrationStep: (state, payload) => {
  //     state.ui.registrationStep += payload
  //   },
  hideBackButton: state => {
    state.ui.backButtonVisible = false
  },
  showBackButton: state => {
    state.ui.backButtonVisible = true
  },
}
