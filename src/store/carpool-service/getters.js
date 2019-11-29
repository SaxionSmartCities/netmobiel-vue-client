export default {
  getRides: state => {
    return state.rides
  },
  getSearchResult: state => {
    return state.search.result
  },
  getSearchLicensePlate: state => {
    return state.search.licensePlate
  },
}
