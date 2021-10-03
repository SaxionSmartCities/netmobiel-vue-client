import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { RootState, storeBuilder } from './Rootstate'

import './ui'
import './charity-service'
import './carpool-service'
import './profile-service'
import './message-service'
import './geocoder-service'
import './itinerary-service'
import './credits-service'

/**
 * Now using both the normal vuex store than can be accessed through this.$store...
 * The vuexStore can be accessed by import the store it's index as following
 * `import * as uiStore from '@/store/ui'`
 */
Vue.use(Vuex)
const store: Store<RootState> = storeBuilder.vuexStore()
// @ts-ignore
store.strict = process.env.NODE_ENV !== 'production'
export default store
