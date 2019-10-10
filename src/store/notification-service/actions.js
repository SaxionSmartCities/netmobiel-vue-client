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
        // eslint-disable-next-line
        console.log(response)
        if (response.status == 200) {
          context.dispatch(
            'ui/queueNotification',
            {
              message: 'Er is een bericht naar de chauffeur verstuurd.',
              timeout: 3000,
            },
            { root: true }
          )
        }
      })
      .catch(error => {
        // eslint-disable-next-line
        console.log(error)
        context.dispatch(
          'ui/queueNotification',
          {
            message: 'Fout bij het versturen van een gebruikersnotificatie.',
            timeout: 0,
          },
          { root: true }
        )
      })
  },
}
