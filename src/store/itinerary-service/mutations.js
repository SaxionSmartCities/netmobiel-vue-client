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
    state.planningRequest.result.plan = payload.data.plan
    state.planningRequest.result.rides = payload.data.rides
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
  setPlannedTrips: (state, payload) => {
    state.plannedTrips = payload
  },
}
