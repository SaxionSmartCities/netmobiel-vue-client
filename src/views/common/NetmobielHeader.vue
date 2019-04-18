<template>
  <nav v-if="isVisible">
    <v-layout align-center justify-end fill-height>
      <v-btn id="logout-button" flat round small class="ma-1 subheading" @click="logout">
        Logout
      </v-btn>
    </v-layout>
  </nav>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    isVisible: function() {
      return this.$store.getters.isHeaderVisible
    },
  },
  methods: {
    logout: function() {
      this.$keycloak.logoutFn()
      this.$store.commit('deleteAccessToken')
    },
  },
}
</script>

<style lang="scss">
nav {
  background: $color-green;
  background-image: url('../../assets/logo_header.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

#logout-button {
  background-color: $color-orange;
  color: white;
}
</style>
