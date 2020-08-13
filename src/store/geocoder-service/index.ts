import { GeoCoderState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/geocoder-service/getters'
import { buildMutations } from '@/store/geocoder-service/mutations'
import { buildActions } from '@/store/geocoder-service/actions'

export const gcBuilder = storeBuilder.module<GeoCoderState>(
  'gc',
  new GeoCoderState()
)

export const getters = buildGetters(gcBuilder)
export const mutations = buildMutations(gcBuilder)
export const actions = buildActions(gcBuilder)
