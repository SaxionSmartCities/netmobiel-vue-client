export default {
  addRideToList: (state, payload) => {
    state.rides.push(payload)
  },
  setSearchLicensePlate: (state, payload) => {
    state.search.licensePlate = payload
  },
  setSearchResult: (state, payload) => {
    state.search.result = payload
  },
  clearSearchResult: state => {
    state.search.result = undefined
  },
}
