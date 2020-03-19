export default {
  getAvailableCars: state => state.cars,
  getRides: state => state.rides,
  getPlannedRidesCount: state => state.plannedRidesCount,
  getSearchResult: state => state.search.result,
  getSearchLicensePlate: state => state.search.licensePlate,
}
