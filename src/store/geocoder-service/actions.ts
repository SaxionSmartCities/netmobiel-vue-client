import axios from 'axios'
import config from '@/config/config'
import { BareActionContext, ModuleBuilder } from 'vuex-typex'
import { GeoCoderRequest, GeoCoderState, GeoCoderSuggestion } from './types'
import { RootState } from '@/store/Rootstate'
import { mutations } from '@/store/geocoder-service/index'
import * as uiStore from '@/store/ui'
import constants from '@/constants/constants'
import { generateHeaders } from '@/utils/Utils'

type ActionContext = BareActionContext<GeoCoderState, RootState>

const { GEOCODE_BASE_URL, GRAVITEE_GEOCODE_SERVICE_API_KEY } = config

function isPhonetic(s: string) {
  // Detection: multiple short words (<= 4 chars) between ()
  if (!s) {
    return false
  }
  const memes: string[] = s
    .substring(s.indexOf('(') + 1, s.indexOf(')'))
    .split(' ')
    .filter((elem) => elem.length <= 4)
  return memes.length > 1
}

async function fetchGeocoderSuggestions(
  context: ActionContext,
  { query, center, radius, maxResults }: GeoCoderRequest
) {
  try {
    const theCenter = center ? center : constants.GEOLOCATION_CENTER_NL
    // Include address information details?
    const showAddressDetails = true
    // Hide phonetic matches like: Input 'rembrandt 8 hen' matches
    // Rembrandtstraat 8, 7651 BW Tubbergen (Di Bei Heng), Nederland
    // This does not help with the input of address info, so remove it by
    // matching on '('
    const hidePhoneticMatches = true
    const resp = await axios.get(`${GEOCODE_BASE_URL}/suggestions`, {
      params: {
        query,
        // Include details: Address information
        details: showAddressDetails,
        radius: radius || constants.DEFAULT_GEOCODER_RADIUS,
        center: `${theCenter.latitude},${theCenter.longitude}`,
        maxResults: maxResults || 20,
      },
      headers: generateHeaders(GRAVITEE_GEOCODE_SERVICE_API_KEY),
    })
    let suggestions: GeoCoderSuggestion[] = resp.data.data
    if (hidePhoneticMatches) {
      suggestions = suggestions.filter((s) => !isPhonetic(s.title))
    }
    mutations.setGeocoderSuggestions(suggestions)
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
