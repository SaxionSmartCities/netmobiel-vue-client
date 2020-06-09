export default {
  getAvailableCars: state => state.cars,
  getRides: state => state.rides,
  getSelectedRide: state => state.selectedRide,
  getPlannedRidesCount: state => state.plannedRidesCount,
  getSearchResult: state => state.search.result,
  getSearchLicensePlate: state => state.search.licensePlate,
}
