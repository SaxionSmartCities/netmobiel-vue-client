export default {
  addRideToList: (state, payload) => state.rides.push(payload),
  setSearchLicensePlate: (state, payload) => {
    state.search.licensePlate = payload
  },
  setSearchResult: (state, payload) => (state.search.result = payload),
  clearSearchResult: state => (state.search.result = undefined),
  setAvailableCars: (state, payload) => (state.cars = payload),
  setPlannedRidesCount: (state, payload) => (state.plannedRidesCount = payload),
  saveRides: (state, payload) => (state.rides = payload),
  appendRides: (state, payload) => (state.rides = state.rides.concat(payload)),
  deleteRides: (state, payload) => {
    for (var i = state.rides.length - 1; i >= 0; --i) {
      if (state.rides[i].id == payload) {
        state.rides.splice(i, 1)
        break
      }
    }
  },
}
