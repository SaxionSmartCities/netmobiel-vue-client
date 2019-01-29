<template>
 <div id="splash-screen">
    <img class="img-fluid" src="@/assets/logo_splash.png">

    <div class="footer">
        <router-link to="/profile" class="btn btn-primary btn-block">Inloggen</router-link>
        <router-link to="/createUser" class="btn btn-primary btn-block">Registreren</router-link>
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
    }
}
</script>

<style scoped lang="scss">
    // Heinze is going to do some flex-box magic here!
</style>
