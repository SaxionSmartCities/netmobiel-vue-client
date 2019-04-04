export default {
  getUser: state => {
    return state.user
  },
  isHeaderVisible: state => {
    return state.ui.header.visible
  },
  isFooterVisible: state => {
    return state.ui.footer.visible
  },
  getLocations: state => {
    return state.user.locations
  },
  getLocationById: state => id => {
    return state.user.locations[id]
  },
  getCurrentSelectedLocationId: state => {
    return state.ui.selectedLocationId
  },
}
