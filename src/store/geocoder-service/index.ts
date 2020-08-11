import { GeoCoderState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import gcGetters from '@/store/geocoder-service/getters'
import gcMutations from '@/store/geocoder-service/mutations'
import gcActions from '@/store/geocoder-service/actions'

export const gcBuilder = storeBuilder.module<GeoCoderState>(
  'gc',
  new GeoCoderState()
)

export const getters = gcGetters
export const mutations = gcMutations
export const actions = gcActions
