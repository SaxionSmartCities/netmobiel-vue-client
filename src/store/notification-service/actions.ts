import axios from 'axios'
import config from '@/config/config'
import { NotificationState } from './types'
import { RootState } from '@/store/Rootstate'
import { BareActionContext, getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import * as uiStore from '@/store/ui'
type ActionContext = BareActionContext<NotificationState, RootState>

// @ts-ignore
const nsBuilder: ModuleBuilder = getStoreBuilder().module('ns')

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
        uiStore.actions.queueNotification(
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
      uiStore.actions.queueNotification(
        {
          message: 'Fout bij het versturen van een gebruikersnotificatie.',
          timeout: 0,
        },
        { root: true }
      )
    })
}

const actions = {
  sendNotification: nsBuilder.dispatch(sendNotification),
}

export default actions
