import axios from 'axios'
import config from '@/config/config'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { GeoCoderState } from './types'
import { RootState } from '@/store/Rootstate'
import { mutations } from '@/store/geocoder-service/index'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<GeoCoderState, RootState>

const GEOCODER_BASE_URL = config.BASE_URL
const GRAVITEE_GEO_SERVICE_API_KEY = config.GRAVITEE_PLANNER_SERVICE_API_KEY

function generateHeaders(key: any) {
  return {
    'X-Gravitee-Api-Key': key,
  }
}

async function fetchGeocoderSuggestions(
  context: ActionContext,
  { query, area, hlStart, hlEnd }: any
) {
  try {
    const resp = await axios.get(
      `${GEOCODER_BASE_URL}/planner/geocode-suggestions`,
      {
        params: {
          query,
          radius: 150000,
          // Default geographic center of the Netherlands (near Lunteren)
          center: area || '52.063045,5.349972',
          result_types: 'place,address',
          hls: hlStart,
          hle: hlEnd,
        },
        headers: generateHeaders(GRAVITEE_GEO_SERVICE_API_KEY),
      }
    )
    // console.log('response ', resp.data.data)
    mutations.setGeocoderSuggestions(resp.data.data)
  } catch (problem) {
    uiStore.actions.queueNotification({
      message: 'Fout bij het ophalen van locatiesuggesties.',
      timeout: 0,
    })
  }
}

export const buildActions = (
  gsBuilder: ModuleBuilder<GeoCoderState, RootState>
) => {
  return {
    fetchGeocoderSuggestions: gsBuilder.dispatch(fetchGeocoderSuggestions),
  }
}
