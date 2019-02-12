<template>
  <div id="splash-screen">
    <img class="img-fluid" src="@/assets/logo_splash.png">
    <div class="footer">
      <a class="btn btn-primary btn-block" @click="$keycloak.loginFn()">Login</a>
      <router-link to="/createUser" class="btn btn-primary btn-block">Registreren</router-link>
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
      this.$store.commit("disableHeader")
      this.$store.commit("disableFooter")
  },
  beforeDestroy() {
      this.$store.commit("enableHeader")
      this.$store.commit("enableFooter")
  },
  mounted() {
    if(this.$keycloak.authenticated) {
      const payload = {
        name : this.$keycloak.fullName,
        email: 'zit in de jwt token',
        accessToken: this.$keycloak.token,
      }
      this.$store.commit('saveUser', payload)
      this.$router.push('/profile')
    }
  }
}
</script>

<style scoped lang="scss">
    // Heinze is going to do some flex-box magic here!
</style>
