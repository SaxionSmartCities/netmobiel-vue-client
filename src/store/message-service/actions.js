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
    console.log(URL)
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
}
