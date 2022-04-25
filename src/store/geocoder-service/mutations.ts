import { ModuleBuilder } from 'vuex-typex'
import { GeoCoderState, GeoCoderSuggestion, PickedLocation } from './types'
import { RootState } from '@/store/Rootstate'
import { Page } from '@/store/types'

function setGeocoderSuggestions(
  state: GeoCoderState,
  payload: Page<GeoCoderSuggestion>
) {
  state.geocoder.suggestions = payload
}

function setGeoLocationPicked(state: GeoCoderState, payload: PickedLocation) {
  state.geocoder.pickedLocations.set(payload.field, payload)
}

function swapLocations(state: GeoCoderState, payload: any) {
  const fieldA = 'to'
  const fieldB = 'from'
  const tmp = state.geocoder.pickedLocations.get(fieldA)
  state.geocoder.pickedLocations.set(
    fieldA,
    state.geocoder.pickedLocations.get(fieldB)
  )
  state.geocoder.pickedLocations.set(fieldB, tmp)
}

function clearAllGeoLocationPicked(state: GeoCoderState, payload: void) {
  state.geocoder.pickedLocations.clear()
}

export const buildMutations = (
  gsBuilder: ModuleBuilder<GeoCoderState, RootState>
) => {
  return {
    setGeocoderSuggestions: gsBuilder.commit(setGeocoderSuggestions),
    setGeoLocationPicked: gsBuilder.commit(setGeoLocationPicked),
    clearAllGeoLocationPicked: gsBuilder.commit(clearAllGeoLocationPicked),
    swapLocations: gsBuilder.commit(swapLocations),
  }
}
