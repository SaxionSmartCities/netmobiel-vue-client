export default {
  getPlanningStatus: state => state.planningRequest.submitStatus,
  getPlanningResults: state => state.planningRequest.result,
  getSelectedTrip: state => state.selectedTrip,
  getPlannedTrips: state => state.plannedTrips,
}
