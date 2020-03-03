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
  setAvailableCars: (state, payload) => {
    state.cars = payload
  },
  saveRides: (state, payload) => {
    state.rides = payload
  },
  appendRides: (state, payload) => {
    state.rides = state.rides.concat(payload)
  },
}
