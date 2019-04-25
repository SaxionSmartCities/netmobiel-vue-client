<template>
  <v-container column fluid class="background-green">
    <v-layout column align-center>
      <v-flex full-width>
        <v-img id="logo" :src="require('@/assets/logo_splash.png')"></v-img>
      </v-flex>
    </v-layout>
    <v-layout column align-center mt-5>
      <v-flex full-width>
        <v-btn round large class="full-width" @click="$keycloak.loginFn()">
          Login
        </v-btn>
      </v-flex>
      <v-flex full-width mt-2>
        <v-btn round large class="full-width" to="/createUser">
          Registreren
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.commit('disableHeader')
    this.$store.commit('disableFooter')
  },
  beforeDestroy() {
    this.$store.commit('enableHeader')
    this.$store.commit('enableFooter')
  },
  mounted() {
    if (this.$keycloak.authenticated) {
      const payload = {
        name: this.$keycloak.fullName,
        email: 'zit in de jwt token',
        accessToken: this.$keycloak.token,
      }
      this.$store.commit('saveUser', payload)
      this.$router.push('/home')
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
