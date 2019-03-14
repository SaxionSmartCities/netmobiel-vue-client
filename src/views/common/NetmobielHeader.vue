<template>
  <nav v-if="isVisible">
    <div id="logout-container" class="container" @click="logout">
      <i class="fas fa-sign-out-alt"></i>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Header",
  computed: {
    isVisible: function() {
      return this.$store.getters.isHeaderVisible;
    }
  },
  methods: {
    logout: function() {
      console.log("Logging out!");
      this.$keycloak.logoutFn();
      this.$store.commit("deleteAccessToken");
    }
  }
};
</script>

<style lang="scss">
nav {
  background: $color-secondary-dark;
  background-image: url("../../assets/logo_header.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  border-bottom: 1px solid $color-primary;
}

#logout-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  color: $color-primary;
}
</style>
