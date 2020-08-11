import { getStoreBuilder, ModuleBuilder } from 'vuex-typex'
import { GeoCoderState } from './types'

// @ts-ignore
const gsBuilder: ModuleBuilder = getStoreBuilder().module('gc')

function setGeocoderSuggestions(state: GeoCoderState, payload: any) {
  state.geocoder.suggestions = payload
}

function setGeoLocationPicked(state: GeoCoderState, payload: any) {
  // @ts-ignore
  state.geocoder.pickedLocations[payload.field] = payload.suggestion
}

function setGeoLocationsPicked(state: GeoCoderState, payload: any) {
  state.geocoder.pickedLocations = payload
}

function setPreFilledTime(state: GeoCoderState, payload: any) {
  state.geocoder.preFilledTime = payload
}

function swapLocations(state: GeoCoderState, payload: any) {
  let tmp = state.geocoder.pickedLocations.to
  state.geocoder.pickedLocations.to = state.geocoder.pickedLocations.from
  state.geocoder.pickedLocations.from = tmp
}

export default {
  setGeocoderSuggestions: gsBuilder.commit(setGeocoderSuggestions),
  setGeoLocationPicked: gsBuilder.commit(setGeoLocationPicked),
  setGeoLocationsPicked: gsBuilder.commit(setGeoLocationsPicked),
  setPreFilledTime: gsBuilder.commit(setPreFilledTime),
  swapLocations: gsBuilder.commit(swapLocations),
}
