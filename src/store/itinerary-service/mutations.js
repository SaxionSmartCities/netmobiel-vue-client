export default {
  storePlanningRequest: (state, payload) => {
    state.planningRequest.fromPlace = payload.fromPlace
    state.planningRequest.toPlace = payload.toPlace
    state.planningRequest.selectedTime = payload.selectedTime
  },
  setPlanningStatus: (state, payload) => {
    state.planningRequest.submitStatus = payload
  },
  setPlanningResults: (state, payload) => {
    state.planningRequest.result.plan = payload.data
  },
  clearPlanningResults: state => {
    state.planningRequest.result.data = ''
  },
  clearPlanningRequest: state => {
    state.planningRequest.submitStatus = {
      status: 'UNSUBMITTED', // Or: 'PENDING', 'SUCCESS', 'FAILED'
      message: '',
    }
  },
  sortItineraries: (state, payload) => {
    state.planningRequest.result.data.itineraries.sort(payload)
  },
  setSelectedTrip: (state, payload) => {
    state.selectedTrip = payload
  },
  setPlannedTripsCount: (state, payload) => {
    state.plannedTripsCount = payload
  },
  setPlannedTrips: (state, payload) => {
    state.plannedTrips = payload
  },
  appendPlannedTrips: (state, payload) => {
    state.plannedTrips = state.plannedTrips.concat(payload)
  },
  setShoutOuts: (state, payload) => (state.shoutOuts = payload),
  setPastTrips: (state, payload) => {
    state.pastTrips = payload
  },
  appendPastTrips: (state, payload) => {
    state.pastTrips = state.pastTrips.concat(payload)
  },
  setPastTripsCount: (state, payload) => {
    state.pastTripsCount = payload
  },
}
