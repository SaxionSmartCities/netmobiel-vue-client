<template>
    <nav v-if="isVisible">
        <div class="container">
            <div class="row justify-content-end">
              <div class="col-4">
                <button class="btn mt-1 btn-netmobiel-white" @click="logout">Logout</button>
              </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
  name: 'Header',
  computed: {
      isVisible: function() {
          return this.$store.getters.isHeaderVisible;
      }
  },
  methods: {
    logout: function() {
      console.log('Logging out!')
      this.$keycloak.logoutFn();
      this.$store.commit('deleteAccessToken');
    }
  }
  
}
</script>

<style lang="scss">
nav {
    background: $color-dark-green;
    background-image: url("../../assets/logo_header.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    height: 50px;
    border-bottom: 1px solid #ffffff;
}

.logo{
  max-width: 175px;
  margin: 0 auto;
}

</style>
