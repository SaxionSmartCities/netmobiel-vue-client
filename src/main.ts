import Vue from 'vue'
import vuetify from './plugins/vuetify'
import VueCompositionAPI from '@vue/composition-api'

import App from './App.vue'
import axios from 'axios'
import store from './store'
import router from './router'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

Vue.config.productionTip = false

function addStaticTokenInterceptor() {
  axios.interceptors.request.use(
    (config) => {
      if (Vue.prototype.$keycloak.authenticated) {
        config.headers!.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

function addStaticResponseInterceptor() {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        // eslint-disable-next-line
        console.warn(
          `No authorization for ${error.config.method?.toUpperCase()} ${
            error.config.url
          }`
        )
        // Redirect to the session expired. Ignore errors saying that others also redirected to that same page.
        router.push('/session-expired').catch((error) => {
          if (error.name !== 'NavigationDuplicated') {
            throw error
          }
        })
      } else if (error.response.status === 500) {
        const data = error.response?.data
        if (data && typeof data === 'string' && data.includes('ECONNREFUSED')) {
          // eslint-disable-next-line
          console.warn('Network issue detected')
        }
      }
      return Promise.reject(error)
    }
  )
}
Vue.use(VueCompositionAPI)
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
    enableLogging: false,
    // The embedded browsers in Android and iOS do not store cookies
    // We don't care about an SSO logout anyway.
    checkLoginIframe: false,
  },
  onAuthRefreshError: function (e: any) {
    // eslint-disable-next-line
    // console.error(e)
  },
  onReady: function () {
    addStaticTokenInterceptor()
    addStaticResponseInterceptor()
    /* eslint-disable no-new */
    new Vue({
      store,
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app')
  },
  onInitSuccess: function () {
    // eslint-disable-next-line
    // console.log('Initialization of Keycloak was successfully')
  },
  onInitError: function (err: Error, e: any) {
    // Does not work yet :(
    // eslint-disable-next-line
    // console.error(err)
  },
})
