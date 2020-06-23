export default {
  getPlanningStatus: state => state.planningRequest.submitStatus,
  getPlanningResults: state => state.planningRequest.result,
  getSelectedTrip: state => state.selectedTrip,
  getPlannedTrips: state => state.plannedTrips,
  getPlannedTripsCount: state => state.plannedTripsCount,
  getPastTrips: state => state.pastTrips,
  getPastTripsCount: state => state.pastTripsCount,
  getPastTripsTotalCount: state => state.pastTripsTotalCount,
  getShoutOuts: state => state.shoutOuts,
  getShoutOutsTotalCount: state => state.shoutOutsTotalCount,
  getMyShoutOuts: state => state.myShoutOuts,
}
