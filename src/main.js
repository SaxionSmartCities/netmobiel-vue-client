import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import store from './store'
import router from './router'
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faMapMarkerAlt, faClock, faSuitcase, faUser, faCar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(BootstrapVue);

library.add(faHome, faMapMarkerAlt, faClock, faSuitcase, faUser, faCar)

Vue.component('font-awesome-icon', FontAwesomeIcon)

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
