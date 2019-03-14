import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import store from './store'
import router from './router'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

Vue.use(BootstrapVue);

Vue.config.productionTip = false

Vue.use(VueKeyCloak, {
  config: {
    "authRealm": "saxion",
    "authUrl": "https://keycloak.actmedialab.nl/auth",
    "authClientId": "netmobiel-poc"
  },
  init: {
    onLoad: 'check-sso'
  },
  onReady: (keycloak) => {
    console.log(`I wonder what Keycloak returns: ${keycloak}`)
    /* eslint-disable no-new */
    new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})
