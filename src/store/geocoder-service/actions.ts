import axios from 'axios'
import util from '@/utils/Utils'
import config from '@/config/config'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { GeoCoderState } from './types'
import { RootState } from '@/store/Rootstate'
import { mutations } from '@/store/geocoder-service/index'
import * as uiStore from '@/store/ui'

type ActionContext = BareActionContext<GeoCoderState, RootState>

const { BASE_URL, GRAVITEE_PLANNER_SERVICE_API_KEY } = config
const { generateHeaders } = util

async function fetchGeocoderSuggestions(
  context: ActionContext,
  { query, area, hlStart, hlEnd }: any
) {
  try {
    const resp = await axios.get(`${BASE_URL}/planner/geocode-suggestions`, {
      params: {
        query,
        radius: 150000,
        // Default geographic center of the Netherlands (near Lunteren)
        center: area || '52.063045,5.349972',
        result_types: 'place,address',
        hls: hlStart,
        hle: hlEnd,
      },
      headers: generateHeaders(GRAVITEE_PLANNER_SERVICE_API_KEY),
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
