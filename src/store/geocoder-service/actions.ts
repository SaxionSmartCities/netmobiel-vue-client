import axios from 'axios'
import util from '@/utils/Utils'
import config from '@/config/config'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { GeoCoderState } from './types'
import { RootState } from '@/store/Rootstate'
import { mutations } from '@/store/geocoder-service/index'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<GeoCoderState, RootState>

const { GEOCODE_BASE_URL, GRAVITEE_GEOCODE_SERVICE_API_KEY } = config
const { generateHeaders } = util

async function fetchGeocoderSuggestions(
  context: ActionContext,
  { query, area }: any
) {
  try {
    const resp = await axios.get(`${GEOCODE_BASE_URL}/suggestions`, {
      params: {
        query,
        details: true,
        radius: 150000,
        // Default geographic center of the Netherlands (near Lunteren)
        center: area || '52.063045,5.349972',
      },
      headers: generateHeaders(GRAVITEE_GEOCODE_SERVICE_API_KEY),
    })
    mutations.setGeocoderSuggestions(resp.data.data)
  } catch (problem) {
    uiStore.actions.queueErrorNotification(
      'Fout bij het ophalen van locatiesuggesties.'
    )
  }
}

export const buildActions = (
  gsBuilder: ModuleBuilder<GeoCoderState, RootState>
) => {
  return {
    fetchGeocoderSuggestions: gsBuilder.dispatch(fetchGeocoderSuggestions),
  }
}
