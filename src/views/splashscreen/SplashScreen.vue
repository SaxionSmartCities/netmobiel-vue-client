<template>
  <div id="splash-screen" class="container">
    <img id="logo" class="img-fluid" src="@/assets/logo_splash.png">
    <div id="splash-buttons">
      <a class="btn btn-block btn-primary" @click="$keycloak.loginFn()">Login</a>
      <router-link to="/createUser" class="btn btn-block btn-primary">Registreren</router-link>
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.$store.commit("disableHeader");
    this.$store.commit("disableFooter");
  },
  beforeDestroy() {
    this.$store.commit("enableHeader");
    this.$store.commit("enableFooter");
  },
  mounted() {
    if (this.$keycloak.authenticated) {
      const payload = {
        name: this.$keycloak.fullName,
        email: "zit in de jwt token",
        accessToken: this.$keycloak.token
      };
      this.$store.commit("saveUser", payload);
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped lang="scss">
#splash-screen {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100vh;
}

#logo {
  align-self: center;
}

#splash-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
