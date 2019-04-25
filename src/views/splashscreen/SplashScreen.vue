<template>
  <v-container column fluid class="background-green">
    <v-layout column align-center>
      <v-flex full-width>
        <v-img id="logo" :src="require('@/assets/logo_splash.png')"></v-img>
        <!-- <img id="logo" src="@/assets/logo_splash.png" /> -->
      </v-flex>
    </v-layout>
    <v-layout column align-center mt-5>
      <v-flex>
        <v-btn round large title @click="$keycloak.loginFn()">
          Login
        </v-btn>
      </v-flex>
      <v-flex mt-4>
        <v-btn round large title to="/createUser">
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
#splash-screen {
  height: 100%;
  background-color: $color-green;
}

.container {
  height: 100%;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: $color-orange;
  width: 250px;
  color: $color-white;
  text-transform: none;
}

#logo {
  max-width: 500px;
  margin: 0 auto;
}
</style>
