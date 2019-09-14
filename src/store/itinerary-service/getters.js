export default {
  getPlanningStatus: state => state.planningRequest.submitStatus,
  getSearchRideDateTime: state => state.planningRequest.dateTime,
  getPlanningResult: state => state.planningRequest.result.data,
  getSelectedTrip: state => state.selectedTrip,
}
