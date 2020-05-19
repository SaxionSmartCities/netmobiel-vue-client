import Vue from 'vue'
import vuetify from './plugins/vuetify'

import App from './App.vue'
import axios from 'axios'
import store from './store'
import router from './router'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import VueAnalytics from 'vue-analytics'

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
      vuetify,
      render: h => h(App),
    }).$mount('#app')
  },
  onInitError: function() {
    // Does not work yet :(
    console.log('init error... :(')
  },
})
