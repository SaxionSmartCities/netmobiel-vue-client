import { CarpoolState } from '@/store/carpool-service/types'
import { storeBuilder } from '@/store/Rootstate'
import csGetters from '@/store/carpool-service/getters'
import csMutations from '@/store/carpool-service/mutations'
import csActions from '@/store/carpool-service/actions'

export const csBuilder = storeBuilder.module<CarpoolState>(
  'cs',
  new CarpoolState()
)
export const getters = csGetters
export const mutations = csMutations
export const actions = csActions
