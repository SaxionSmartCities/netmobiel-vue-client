export default {
  getUser: state => {
    return state.user
  },
  getRidePreferences: state => {
    return state.user.ridePreferences
  },
  getPrivacySecurity: state => {
    return state.user.privacySecurity
  },
  getNotificationOptions: state => {
    return state.user.notificationOptions
  },
  getNotifcationProfileOptions: state => {
    return state.user.profile
  },
  getReviewsOptions: state => {
    return state.user.reviews
  },
}
