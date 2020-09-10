import axios from 'axios'
import config from '@/config/config'
import { NotificationState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<NotificationState, RootState>

const BASE_URL = config.BASE_URL
const GRAVITEE_NOTIFICATION_SERVICE_API_KEY =
  config.GRAVITEE_NOTIFICATION_SERVICE_API_KEY

function generateHeader(key: any) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

function sendNotification(context: ActionContext, payload: any) {
  const URL = BASE_URL + '/notifications'
  axios
    .post(URL, payload, {
      headers: generateHeader(GRAVITEE_NOTIFICATION_SERVICE_API_KEY),
    })
    .then(response => {
      // eslint-disable-next-line
      console.log(response)
      if (response.status == 200) {
        uiStore.actions.queueInfoNotification(
          'Er is een bericht naar de chauffeur verstuurd.'
        )
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
      uiStore.actions.queueErrorNotification(
        'Fout bij het versturen van een gebruikersnotificatie.'
      )
    })
}

export const buildActions = (
  builder: ModuleBuilder<NotificationState, RootState>
) => {
  return {
    sendNotification: builder.dispatch(sendNotification),
  }
}
