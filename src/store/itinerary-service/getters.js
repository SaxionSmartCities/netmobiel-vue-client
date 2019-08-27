export default {
  getPlanningStatus: state => {
    return state.planningRequest.submitStatus
  },
  getSearchRideDateTime: state => {
    return state.planningRequest.dateTime
  },
  getItineraries: state => {
    return state.planningRequest.result.data.itineraries
  },
  getSelectedItinerary: state => state.selectedItinerary,
}
