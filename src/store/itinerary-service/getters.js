export default {
  getPlanningStatus: state => state.planningRequest.submitStatus,
  getPlanningResult: state => state.planningRequest.result.data,
  getSelectedTrip: state => state.selectedTrip,
  getPlannedTrips: state => state.plannedTrips,
}
