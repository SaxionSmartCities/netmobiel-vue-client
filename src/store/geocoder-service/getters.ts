import { ModuleBuilder } from 'vuex-typex'
import { GeoCoderState } from './types'
import { RootState } from '@/store/Rootstate'

export const buildGetters = (
  gsBuilder: ModuleBuilder<GeoCoderState, RootState>
) => {
  const getGeocoderSuggestions = gsBuilder.read((state: GeoCoderState) => {
    return state.geocoder.suggestions
  }, 'getGeocoderSuggestions')

  const getPickedLocation = gsBuilder.read((state: GeoCoderState) => {
    return state.geocoder.pickedLocations
  }, 'getPickedLocation')

  const getPreFilledTime = gsBuilder.read((state: GeoCoderState) => {
    return state.geocoder.preFilledTime
  }, 'getPreFilledTime')

  return {
    get getGeocoderSuggestions() {
      return getGeocoderSuggestions()
    },
    get getPickedLocation() {
      return getPickedLocation()
    },
    get getPreFilledTime() {
      return getPreFilledTime()
    },
  }
}
