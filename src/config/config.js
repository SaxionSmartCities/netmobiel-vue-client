export default {
  BASE_URL:
    process.env.VUE_APP_API_BASE_URL || 'https://api.netmobiel.eu/gwapi/acc',
  GRAVITEE_PLANNER_SERVICE_API_KEY: process.env.VUE_APP_PLANNER_SERVICE_API_KEY,
  GRAVITEE_PROFILE_SERVICE_API_KEY: process.env.VUE_APP_PROFILE_SERVICE_API_KEY,
  GRAVITEE_GEO_SERVICE_API_KEY: process.env.VUE_APP_GEO_SERVICE_API_KEY,
  GRAVITEE_NOTIFICATION_SERVICE_API_KEY:
    process.env.VUE_APP_NOTIFICATION_SERVICE_API_KEY,
  GRAVITEE_TRIP_SERVICE_API_KEY: process.env.VUE_APP_TRIP_SERVICE_API_KEY,
  GRAVITEE_RIDESHARE_SERVICE_API_KEY:
    process.env.VUE_APP_RIDESHARE_SERVICE_API_KEY,
}
