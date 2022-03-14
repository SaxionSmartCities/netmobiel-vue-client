export default {
  BANKER_BASE_URL: `${process.env.VUE_APP_SERVICE_URL}/banker`,
  COMMUNICATOR_BASE_URL: `${process.env.VUE_APP_SERVICE_URL}/communicator`,
  PLANNER_BASE_URL: `${process.env.VUE_APP_SERVICE_URL}/planner`,
  GEOCODE_BASE_URL: `${process.env.VUE_APP_SERVICE_URL}/geo`,
  PROFILE_BASE_URL: `${process.env.VUE_APP_SERVICE_URL}/profilesvc`,
  RIDESHARE_BASE_URL: `${process.env.VUE_APP_SERVICE_URL}/rideshare`,
  IMAGES_BASE_URL: `${process.env.VUE_APP_SERVICE_URL}/images`,
  GRAVITEE_BANKER_SERVICE_API_KEY: process.env.VUE_APP_BANKER_SERVICE_API_KEY,
  GRAVITEE_COMMUNICATOR_SERVICE_API_KEY:
    process.env.VUE_APP_COMMUNICATOR_SERVICE_API_KEY,
  GRAVITEE_PLANNER_SERVICE_API_KEY: process.env.VUE_APP_PLANNER_SERVICE_API_KEY,
  GRAVITEE_GEOCODE_SERVICE_API_KEY: process.env.VUE_APP_GEOCODE_SERVICE_API_KEY,
  GRAVITEE_PROFILE_SERVICE_API_KEY: process.env.VUE_APP_PROFILE_SERVICE_API_KEY,
  GRAVITEE_RIDESHARE_SERVICE_API_KEY:
    process.env.VUE_APP_RIDESHARE_SERVICE_API_KEY,
  MAPBOX_TOKEN: process.env.VUE_APP_MAPBOX_TOKEN,
  CREDITS_ENABLED: process.env.VUE_APP_CREDITS_ENABLED === 'true',
  BANK_SIMULATED: process.env.VUE_APP_BANK_SIMULATED === 'true',
  GIT_HASH: process.env.VUE_APP_GIT_HASH,
  BUILD_TIME: process.env.VUE_APP_BUILD_TIME,
}
