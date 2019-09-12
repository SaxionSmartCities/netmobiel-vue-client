export default {
  getPlanningStatus: state => state.planningRequest.submitStatus,
  getSearchRideDateTime: state => state.planningRequest.dateTime,
  getItineraries: state => state.planningRequest.result.data.itineraries,
  getSelectedItinerary: state => state.selectedItinerary,
}
