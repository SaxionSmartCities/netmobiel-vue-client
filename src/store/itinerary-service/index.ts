import { ItineraryState } from './types'
import { storeBuilder } from '@/store/Rootstate'
import isGetters from '@/store/itinerary-service/getters'
import isMutations from '@/store/itinerary-service/mutations'
import isActions from '@/store/itinerary-service/actions'

export const isBuilder = storeBuilder.module<ItineraryState>(
  'is',
  new ItineraryState()
)
export const getters = isGetters
export const mutations = isMutations
export const actions = isActions
