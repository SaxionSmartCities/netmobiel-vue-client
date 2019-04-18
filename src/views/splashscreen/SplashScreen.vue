<template>
  <v-container id="splash-screen" class="background-green">
    <v-layout justify-center>
      <img id="logo" class="img-fluid" src="@/assets/logo_splash.png" />
    </v-layout>
    <v-layout align-center justify-center column id="splash-buttons">
      <v-btn
        round
        large
        class="mb-2 title"
        @click="$keycloak.loginFn()"
        id="loginButton"
        >Login</v-btn
      >
      <v-btn class="title" id="registrateButton" round large to="/createUser"
        >Registreren</v-btn
      >
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
  height: 100vh;
}

#logo {
  max-width: 105%;
}

.v-btn {
  width: 250px;
  color: white;
  text-transform: none;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat){
  background-color: $color-orange;
}
</style>
