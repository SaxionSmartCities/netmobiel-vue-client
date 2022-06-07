<template>
  <v-container fluid class="background-primary full-height">
    <v-row class="image-container">
      <v-col align-self="end" cols="12">
        <v-img id="logo" :src="require('@/assets/logo_splash.png')" />
      </v-col>
    </v-row>
    <v-row v-if="progressVisible" class="d-flex flex-row justify-center">
      <v-col class="shrink">
        <v-progress-circular indeterminate color="button"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-if="buttonsVisible">
      <v-col cols="12">
        <v-btn color="button" rounded large block @click="loginAtKeycloak()">
          Aanmelden
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-btn color="button" rounded large block @click="registerAtKeycloak()">
          Registreren
        </v-btn>
      </v-col>
      <v-col cols="12" class="text-center">
        <span class="caption white--text"
          >Versie: {{ config.GIT_HASH }} ({{ config.BUILD_TIME }})</span
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as msStore from '@/store/message-service'
import config from '@/config/config'

export default {
  data() {
    return {
      buttonsVisible: false,
      progressVisible: false,
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    config() {
      return config
    },
  },
  beforeCreate() {
    uiStore.mutations.disableHeader()
    uiStore.mutations.disableFooter()
  },
  mounted() {
    // Navigation rules:
    // If not authenticated then show the landing page with the choice between login and register
    // Else If the profile exists --> goto home page
    // Else --> goto registrationPage
    // When being redirected from external pages (e.g. credit deposit), the user should return to the proper page
    // Follow then the redirect.
    if (this.$keycloak.authenticated) {
      this.progressVisible = true
      // Show YBug on normal pages
      // YbugHelper.show()
      // Token and Profile are also fetched in the main template (App.vue)
      // Here we check what we need to do when no profile is present
      // Check first the connection with the server, then verify the existence of the profile.
      psStore.actions
        .fetchVersion()
        .then(() => psStore.actions.fetchMyProfileStatus())
        .then(() => this.continueNavigation())
        .catch((status) => {
          // Gateway/server trouble or not found
          // If no then go to the registration page
          this.progressVisible = false
          this.buttonsVisible = true
          if (status === 404) {
            return this.startRegistration()
          } else if (status >= 500) {
            return uiStore.actions.queueErrorNotification(
              'De Netmobiel server is momenteel niet beschikbaar, probeer het later opnieuw'
            )
          }
        })
    } else {
      // Not authenticated. User decides between 'login' and 'register'
      // YbugHelper.hide()
      this.buttonsVisible = true
    }
  },
  methods: {
    continueNavigation() {
      // Check whether we have an initial message to show (a query parameter added by the mobile app)
      if (this.$route.query.msgId) {
        // eslint-disable-next-line
        // console.log(`Got an initial message: '${this.$route.query.msgId}'`)
        return msStore.actions
          .fetchMessage({ id: this.$route.query.msgId })
          .then((msg) => {
            // Now goto the relevant (i.e., my) conversation. Find whether
            // that should be the sender's conversation or the recipient
            // Normally that would be the recipient
            let conversationId
            if (msg?.sender?.managedIdentity === this.profile.id) {
              conversationId = msg.senderConversationRef
            } else {
              conversationId = msg?.envelopes.find(
                (env) => env.recipient.managedIdentity === this.profile.id
              )?.conversationRef
            }
            if (conversationId) {
              return this.$router.push({
                name: 'conversation',
                params: { conversationId },
              })
            } else {
              this.$router.push({ path: '/home' })
            }
          })
          .catch(() => {})
      } else {
        // Redirect to the home page
        return this.$router.push({ path: '/home' })
      }
    },
    startRegistration() {
      return this.$router.push({ name: 'registerUser' })
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
// Prevent moving buttons during loading of image
// by setting the buttons on a relatively fixed position
.image-container {
  min-height: 40vh;
}
</style>
