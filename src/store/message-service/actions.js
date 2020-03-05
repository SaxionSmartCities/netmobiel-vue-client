import axios from 'axios'
import config from '@/config/config'

const BASE_URL = config.BASE_URL
const GRAVITEE_COMMUNICATOR_SERVICE_API_KEY =
  config.GRAVITEE_COMMUNICATOR_SERVICE_API_KEY

function generateHeaders(key) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

export default {
  fetchMessages: () => {
    const URL = BASE_URL + `/communicator/messages`
    axios
      .get(URL, {
        headers: generateHeaders(GRAVITEE_COMMUNICATOR_SERVICE_API_KEY),
      })
      .then(function(resp) {
        console.log(resp.data)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
  sendMessage: (context, { urn, message, mode, recipients }) => {
    const URL = BASE_URL + `/communicator/messages`
    const body = {
      context: urn,
      deliveryMode: mode,
      recipients,
      body: message,
    }
    axios
      .post(URL, body, {
        headers: generateHeaders(GRAVITEE_COMMUNICATOR_SERVICE_API_KEY),
      })
      .then(function(resp) {
        console.log(resp.data)
      })
      .catch(function(error) {
        // TODO: Proper error handling.
        // eslint-disable-next-line
        console.log(error)
      })
  },
}
