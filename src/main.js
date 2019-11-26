import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'
import axios from 'axios'
import moment from 'moment'
import store from './store'
import router from './router'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import VueAnalytics from 'vue-analytics'

Vue.use(Vuetify, {
  themes: {
    light: {
      primary: '#2E8997',
      secondary: '#FF8500',
      accent: '#FFFFFF',
      error: '#D0021B',
    },
  },
})

Vue.config.productionTip = false

function tokenInterceptor() {
  axios.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
}
let googleAnalyticsTrackingId = process.env.VUE_APP_GA_ID
if (googleAnalyticsTrackingId) {
  Vue.use(VueAnalytics, {
    id: googleAnalyticsTrackingId,
    router, //auto tracks all the page changes
    autoTracking: {
      exception: true, //reports exception errors to Google Analytics
    },
  })
}

Vue.use(VueKeyCloak, {
  config: {
    authRealm: 'netmobiel',
    authUrl: 'https://keycloak.actmedialab.nl/auth',
    authClientId: 'netmobiel-frontend',
  },
  init: {
    onLoad: 'check-sso',
  },
  onReady: function() {
    tokenInterceptor()
    /* eslint-disable no-new */
    new Vue({
      store,
      router,
      render: h => h(App),
    }).$mount('#app')
  },
})

// force dutch locale for names of weekdays, months, etc.
moment.locale('nl')
