import Vue from 'vue'
import Vuex from 'vuex'

import profileService from './profile-service'
import registrationService from './registration-service'
import itineraryService from './itinerary-service'
import geocoderService from './geocoder-service'
import carpoolService from './carpool-service'
import ui from './ui'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    ui: ui,
    ps: profileService,
    rs: registrationService,
    is: itineraryService,
    gs: geocoderService,
    cs: carpoolService,
  },
})
