<template>
  <v-container fluid class="background-primary fill-height">
    <v-layout column>
      <v-flex xs6>
        <v-img id="logo" :src="require('@/assets/logo_splash.png')"></v-img>
      </v-flex>

      <v-flex>
        <v-layout wrap>
          <v-flex xs12>
            <v-btn
              color="button"
              rounded
              large
              block
              @click="$keycloak.loginFn()"
            >
              Login
            </v-btn>
          </v-flex>
          <v-flex xs12 mt-3>
            <v-btn color="button" rounded large block to="/createUser">
              Registreren
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as uiStore from '@/store/ui'
export default {
  beforeCreate() {
    uiStore.mutations.disableFooter()
    uiStore.mutations.disableFooter()
  },
  mounted() {
    if (this.$keycloak.authenticated) {
      this.$store.commit('ps/setUserToken', this.$keycloak.token)
      // Preserve query string when routing to home.
      this.$router.push({ path: '/home', query: this.$route.query })
    }
  },
}
</script>

<style scoped lang="scss">
#logo {
  max-width: 500px;
  margin: 0 auto;
}
</style>
