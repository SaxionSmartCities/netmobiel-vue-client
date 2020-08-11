import Vue from 'vue'
import Vuex from 'vuex'

import itineraryService from './itinerary-service'
import { RootState, storeBuilder } from './Rootstate'

// NEED TO IMPORT THE STRONGLY TYPES STORES HERE, ELSE THE STORES WON'T BE BUILT!!!
import './ui'
import './ui'
import './charity-service'
import './carpool-service'
import './registration-service'
import './profile-service'
import './notification-service'
import './message-service'
import './geocoder-service'

/**
 * Now using both the normal vuex store than can be accessed through this.$store...
 * The vuexStore can be accessed by import the store it's index as following
 * 'import * as uiStore from '@/store/ui''
 */
Vue.use(Vuex)
storeBuilder.vuexStore()

export default new Vuex.Store<RootState>({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    is: itineraryService,
  },
})
