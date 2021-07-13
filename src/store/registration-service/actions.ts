import axios from 'axios'
import config from '@/config/config'
import util from '@/utils/Utils'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { RegistrationRequest, RegistrationState } from './types'
import { mutations } from '@/store/registration-service'
import { RootState } from '@/store/Rootstate'
type ActionContext = BareActionContext<RegistrationState, RootState>

const { PROFILE_BASE_URL, GRAVITEE_PROFILE_SERVICE_API_KEY } = config
const { generateHeaders } = util

function submitRegistrationRequest(payload: RegistrationRequest) {
  const URL = `${PROFILE_BASE_URL}/profiles`
  mutations.storeRegistrationRequest(payload)
  return axios
    .post(URL, payload, {
      headers: generateHeaders(GRAVITEE_PROFILE_SERVICE_API_KEY),
    })
    .then(function() {
      mutations.setRegistrationStatus({ success: true, message: '' })
    })
    .catch(function(error) {
      const status = error.response.status
      let errorMsg = ''
      if (status === 422) {
        errorMsg = 'Ontbrekende data (email, voornaam of achternaam).'
      } else if (status === 451) {
        errorMsg =
          'Ga akkoord  met de voorwaarden en bevestig 16 jaar of ouder te zijn.'
      } else if (status === 500) {
        // No clue what is going on, but the server should report something about it
        errorMsg = error.response.data.message || error.response.data
      } else if (status === 409) {
        errorMsg = 'Het emailadres is al in gebruik.'
      }

      mutations.setRegistrationStatus({
        success: false,
        message: errorMsg,
      })
    })
}

function newAccountRegistration(
  context: ActionContext,
  payload: RegistrationRequest
): void {
  submitRegistrationRequest(payload)
}

function newDelegateRegistration(
  context: ActionContext,
  payload: RegistrationRequest
) {
  mutations.clearRegistrationRequest()
  submitRegistrationRequest(payload)
    .then(() => {
      //TODO: Set delegation.
      console.log('Success!')
    })
    .catch(error => {
      // eslint-disable-next-line
      console.log(error)
    })
}

export const buildActions = (
  rsBuilder: ModuleBuilder<RegistrationState, RootState>
) => {
  return {
    submitRegistrationRequest: rsBuilder.dispatch(newAccountRegistration),
    newDelegateRegistration: rsBuilder.dispatch(newDelegateRegistration),
  }
}
