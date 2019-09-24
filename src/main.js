import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'
import axios from 'axios'
import store from './store'
import router from './router'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import VueAnalytics from 'vue-analytics'

Vue.use(Vuetify, { theme: false })

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

Vue.use(VueAnalytics, {
  id: 'UA-148605229-1', //Should this be added as an ENV var?
  router, //auto tracks all the page changes
  autoTracking: {
    exception: true, //reports exception errors to Google Analytics
  },
})

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
