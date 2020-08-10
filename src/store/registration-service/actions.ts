import axios from 'axios'
import config from '@/config/config'
import { BareActionContext, getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { RegistrationState } from './types'
import { mutations } from '@/store/registration-service/index'
import { RootState } from '@/store/Rootstate'
// @ts-ignore
const rsBuilder: ModuleBuilder = getStoreBuilder().module('rs')
type ActionContext = BareActionContext<RegistrationState, RootState>

const BASE_URL = config.BASE_URL
const GRAVITEE_PROFILE_SERVICE_API_KEY = config.GRAVITEE_PROFILE_SERVICE_API_KEY

function generateHeader(key: any) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

function submitRegistrationRequest(context: ActionContext, payload: any): void {
  mutations.storeRegistrationRequest(payload)

  var axiosConfig = {
    method: 'POST',
    url: BASE_URL + '/profiles',
    data: context.state.registrationRequest,
    headers: generateHeader(GRAVITEE_PROFILE_SERVICE_API_KEY),
  }

  axios(axiosConfig)
    .then(function() {
      mutations.setRegistrationStatus({ success: true, message: '' })
    })
    .catch(function(error) {
      const status = error.response.status
      var errorMsg = ''
      if (status === 422) {
        errorMsg = 'Ontbrekende data (email, voornaam of achternaam).'
      } else if (status === 451) {
        errorMsg =
          'Ga akkoord gaan met de voorwaarden alsmede 16 jaar of ouder zijn.'
      } else if (status === 500) {
        errorMsg = error.response.data.message // No clue what is going on, but the server should report something about it
      } else if (status === 409) {
        errorMsg = 'Het emailadres is al in gebruik.'
      }

      mutations.setRegistrationStatus({
        success: false,
        message: errorMsg,
      })
    })
}

export default {
  submitRegistrationRequest: rsBuilder.dispatch(submitRegistrationRequest),
}
