export default {
  getAvailableCars: state => state.cars,
  getRides: state => state.rides,
  getSearchResult: state => state.search.result,
  getSearchLicensePlate: state => state.search.licensePlate,
}
