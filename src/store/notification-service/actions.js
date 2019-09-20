import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL
const GRAVITEE_NOTIFICATION_SERVICE_API_KEY =
  config.GRAVITEE_NOTIFICATION_SERVICE_API_KEY

function generateHeader(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  sendNotification: (context, payload) => {
    const URL = BASE_URL + '/notifications'
    axios
      .post(URL, payload, {
        headers: generateHeader(GRAVITEE_NOTIFICATION_SERVICE_API_KEY),
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
