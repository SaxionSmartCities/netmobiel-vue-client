import Vue from 'vue'
import vuetify from './plugins/vuetify'

import App from './App.vue'
import axios from 'axios'
import store from './store'
import router from './router'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

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

Vue.use(VueKeyCloak, {
  config: {
    authRealm: 'netmobiel',
    authUrl: 'https://keycloak.actmedialab.nl/auth',
    authClientId: 'netmobiel-frontend',
  },
  logout: {
    redirectUri: window.location.origin,
  },
  init: {
    onLoad: 'check-sso',
    enableLogging: true,
    // The embedded browsers in Android and iOS do not store cookies
    // We don't care about an SSO logout anyway.
    checkLoginIframe: false,
  },
  onAuthRefreshError: function(e: any) {
    // eslint-disable-next-line
    console.error(e)
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
  onInitSuccess: function() {
    // eslint-disable-next-line
    // console.log('Initialization of Keycloak was successfully')
  },
  onInitError: function(err: Error, e: any) {
    // Does not work yet :(
    // eslint-disable-next-line
    console.error(err)
  },
})
