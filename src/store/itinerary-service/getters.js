export default {
  getPlanningStatus: state => state.planningRequest.submitStatus,
  getItineraries: state => state.planningRequest.result.data.itineraries,
  getSelectedItinerary: state => state.selectedItinerary,
}
