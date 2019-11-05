<template>
  <v-container grid-list-lg fluid class="background-green">
    <v-layout>
      <v-flex xs12>
        <v-img id="logo" :src="require('@/assets/logo_splash.png')"></v-img>
      </v-flex>
    </v-layout>
    <v-layout row wrap mt-5>
      <v-flex xs12 md6>
        <v-btn
          color="secondary"
          rounded
          large
          block
          @click="$keycloak.loginFn()"
        >
          Login
        </v-btn>
      </v-flex>
      <v-flex xs12 md6>
        <v-btn color="secondary" rounded large block to="/createUser">
          Registreren
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.commit('ui/disableHeader')
    this.$store.commit('ui/disableFooter')
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
