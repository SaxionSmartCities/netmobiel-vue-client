import Vue from 'vue'
import Vuex from 'vuex'

import carpoolService from './carpool-service'
import geocoderService from './geocoder-service'
import itineraryService from './itinerary-service'
import messageService from './message-service'
import notificationService from './notification-service'
import profileService from './profile-service'
import registrationService from './registration-service'
import goalsService from './goals-service'
import ui from './ui'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    cs: carpoolService,
    gs: geocoderService,
    is: itineraryService,
    ms: messageService,
    pn: notificationService,
    ps: profileService,
    rs: registrationService,
    sg: goalsService,
    ui: ui,
  },
})
