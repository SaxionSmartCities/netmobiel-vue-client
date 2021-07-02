<template>
  <v-container fluid class="background-primary fill-height container">
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-img id="logo" :src="require('@/assets/logo_splash.png')" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-btn color="button" rounded large block @click="$keycloak.loginFn()">
          Login
        </v-btn>
      </v-col>
      <v-col cols="12" class="pa-0 mt-3">
        <v-btn color="button" rounded large block to="/createUser">
          Registreren
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import { isAbsoluteUrl } from '@/utils/Utils'

export default {
  beforeCreate() {
    uiStore.mutations.disableHeader()
    uiStore.mutations.disableFooter()
  },
  mounted() {
    if (this.$keycloak.authenticated) {
      psStore.actions.fetchProfile()
      psStore.mutations.setUserToken(this.$keycloak.token)
      if (this.$route.query.redirect) {
        if (isAbsoluteUrl(this.$route.query.redirect)) {
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
    }
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
</style>
