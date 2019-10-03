export default {
  addRideToList: (state, payload) => {
    state.rides.push(payload)
  },
  saveRides: (state, payload) => {
    state.rides = payload
  },
}
