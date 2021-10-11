<template>
  <v-container fluid class="background-primary fill-height container">
    <v-row class="image-container">
      <v-col align-self="end" cols="12" class="pa-0">
        <v-img id="logo" :src="require('@/assets/logo_splash.png')" />
      </v-col>
    </v-row>
    <v-row v-if="buttonsVisible">
      <v-col cols="12" class="pa-0">
        <v-btn color="button" rounded large block @click="loginAtKeycloak()">
          Login
        </v-btn>
      </v-col>
      <v-col cols="12" class="pa-0 mt-3">
        <v-btn color="button" rounded large block @click="registerAtKeycloak()">
          Registreren
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import { NetworkRequestStatus } from '@/store/ui/types'
import { isAbsoluteUrl } from '@/utils/Utils'

export default {
  computed: {
    networkRequest() {
      return uiStore.getters.getNetworkRequest
    },
    buttonsVisible() {
      return true
      // 2021-10-11 Sometimes the app is stuck on this page
      // const nwstatus = this.networkRequest?.submitStatus?.status
      // return (
      //   nwstatus === NetworkRequestStatus.FAILED ||
      //   !this.$keycloak.authenticated
      // )
    },
  },
  watch: {
    networkRequest(newValue) {
      if (newValue.submitStatus.status === NetworkRequestStatus.SUCCESS) {
        this.continueNavigation()
      } else if (newValue.submitStatus.status === NetworkRequestStatus.FAILED) {
        if (newValue.submitStatus.statusCode === 404) {
          this.startRegistration()
        } else {
          uiStore.actions.queueErrorNotification(
            'Fout bij het ophalen van het profiel.'
          )
        }
      }
    },
  },
  beforeCreate() {
    uiStore.mutations.disableHeader()
    uiStore.mutations.disableFooter()
  },
  mounted() {
    if (this.$keycloak.authenticated) {
      // Show YBug on normal pages
      Ybug.show('launcher')
      // Token and Profile are also fetched in the main template (App.vue)
      uiStore.mutations.resetNetworkRequest()
      psStore.actions.fetchProfile()
      // How are we sure the networkRequestStatus concerns our request? We need a correlationId!
      // Now we have to wait for the results from the database: Does the user already exists?
      // If yes, then proceed to the home page
      // If no then go to the registration page
      // Note: This is only needed for a smooth transition between multiple instances of Netmobiel while using a
      // single Keycloak instance.
    } else {
      // No Ybug on the landing page, not nice to see and not necessary
      Ybug.hide('launcher')
    }
  },
  methods: {
    continueNavigation: function() {
      if (this.$route.query.redirect) {
        if (isAbsoluteUrl(this.$route.query.redirect)) {
          // eslint-disable-next-line
          console.warn(`Blocked redirect: '${this.$route.query.redirect}'`)
          uiStore.actions.queueErrorNotification(`Externe pagina geblokkeerd`)
          // Redirect to the home page
          this.$router.push({ path: '/home' })
        } else {
          this.$router.push({ path: this.$route.query.redirect })
        }
      } else {
        // Preserve query string when routing to home.
        this.$router.push({ path: '/home', query: this.$route.query })
      }
    },
    startRegistration: function() {
      this.$router.push({ name: 'createUser' })
    },
    loginAtKeycloak() {
      return this.$keycloak.loginFn()
    },
    registerAtKeycloak() {
      return this.$keycloak.register()
    },
  },
}
</script>

<style scoped lang="scss">
#logo {
  max-width: min(500px, 100%);
  margin: 0 auto;
}
.container {
  align-content: flex-start;
}
// Prevent moving buttons during loading of image
// by setting the buttons on a relatively fixed position
.image-container {
  min-height: 40vh;
}
</style>
