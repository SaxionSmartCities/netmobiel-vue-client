import { ModuleBuilder } from 'vuex-typex'
import { GeoCoderState, GeoCoderSuggestion } from './types'
import { RootState } from '@/store/Rootstate'

function setGeocoderSuggestions(
  state: GeoCoderState,
  payload: GeoCoderSuggestion[]
) {
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

export const buildMutations = (
  gsBuilder: ModuleBuilder<GeoCoderState, RootState>
) => {
  return {
    setGeocoderSuggestions: gsBuilder.commit(setGeocoderSuggestions),
    setGeoLocationPicked: gsBuilder.commit(setGeoLocationPicked),
    setGeoLocationsPicked: gsBuilder.commit(setGeoLocationsPicked),
    setPreFilledTime: gsBuilder.commit(setPreFilledTime),
    swapLocations: gsBuilder.commit(swapLocations),
  }
}
