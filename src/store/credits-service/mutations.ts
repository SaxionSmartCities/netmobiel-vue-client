import { ModuleBuilder } from 'vuex-typex'
import { CreditsState } from './types'
import { RootState } from '@/store/Rootstate'

// function setGeocoderSuggestions(
//   state: CreditsState,
//   payload: GeoCoderSuggestion[]
// ) {
//   state.geocoder.suggestions = payload
// }

// function setGeoLocationPicked(state: CreditsState, payload: any) {
//   // @ts-ignore
//   state.geocoder.pickedLocations[payload.field] = payload.suggestion
// }

// function setGeoLocationsPicked(state: CreditsState, payload: any) {
//   state.geocoder.pickedLocations = payload
// }

// function setPreFilledTime(state: CreditsState, payload: any) {
//   state.geocoder.preFilledTime = payload
// }

// function swapLocations(state: CreditsState, payload: any) {
//   let tmp = state.geocoder.pickedLocations.to
//   state.geocoder.pickedLocations.to = state.geocoder.pickedLocations.from
//   state.geocoder.pickedLocations.from = tmp
// }

export const buildMutations = (
  gsBuilder: ModuleBuilder<CreditsState, RootState>
) => {
  return {
    // setGeocoderSuggestions: gsBuilder.commit(setGeocoderSuggestions),
    // setGeoLocationPicked: gsBuilder.commit(setGeoLocationPicked),
    // setGeoLocationsPicked: gsBuilder.commit(setGeoLocationsPicked),
    // setPreFilledTime: gsBuilder.commit(setPreFilledTime),
    // swapLocations: gsBuilder.commit(swapLocations),
  }
}
