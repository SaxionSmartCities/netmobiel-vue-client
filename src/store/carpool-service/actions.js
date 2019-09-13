// import axios from 'axios'
// import config from '@/config/config'
// import moment from 'moment'

// const BASE_URL = config.BASE_URL
// const GRAVITEE_PLAN_SERVICE_API_KEY = config.GRAVITEE_PLAN_SERVICE_API_KEY

// function generateHeader(key) {
//   return {
//     'X-Gravitee-Api-Key': key,
//   }
// }

export default {
  submitRide: (context, payload) => {
    context.commit('addRideToList', payload)
  },
}
