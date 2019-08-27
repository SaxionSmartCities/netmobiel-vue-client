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
  //   incrementRegistrationStep: (state, payload) => {
  //     state.ui.registrationStep += payload
  //   },
  hideBackButton: state => {
    state.backButtonVisible = false
  },
  showBackButton: state => {
    state.backButtonVisible = true
  },
}
