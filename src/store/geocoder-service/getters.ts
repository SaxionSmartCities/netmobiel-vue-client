import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { GeoCoderState } from './types'

// @ts-ignore
const gsBuilder: ModuleBuilder = getStoreBuilder().module('gc')

const getGeocoderSuggestions = gsBuilder.read((state: GeoCoderState) => {
  return state.geocoder.suggestions
}, 'getGeocoderSuggestions')

const getPickedLocation = gsBuilder.read((state: GeoCoderState) => {
  return state.geocoder.pickedLocations
}, 'getPickedLocation')

const getPreFilledTime = gsBuilder.read((state: GeoCoderState) => {
  return state.geocoder.preFilledTime
}, 'getPreFilledTime')

export default {
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
