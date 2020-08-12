import { CarpoolState } from '@/store/carpool-service/types'
import { storeBuilder } from '@/store/Rootstate'
import { buildGetters } from '@/store/carpool-service/getters'
import { buildMutations } from '@/store/carpool-service/mutations'
import { buildActions } from '@/store/carpool-service/actions'

export const csBuilder = storeBuilder.module<CarpoolState>(
  'cs',
  new CarpoolState()
)
export const getters = buildGetters(csBuilder)
export const mutations = buildMutations(csBuilder)
export const actions = buildActions(csBuilder)
