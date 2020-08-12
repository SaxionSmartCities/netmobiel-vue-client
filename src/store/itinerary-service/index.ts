import { ItineraryState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/itinerary-service/getters'
import { buildMutations } from '@/store/itinerary-service/mutations'
import { buildActions } from '@/store/itinerary-service/actions'

export const isBuilder = storeBuilder.module<ItineraryState>(
  'is',
  new ItineraryState()
)
export const getters = buildGetters(isBuilder)
export const mutations = buildMutations(isBuilder)
export const actions = buildActions(isBuilder)
