<template>
  <v-layout v-if="isVisible" header fill-height justify-end align-center>
    <v-flex pa-1 shrink>
      <v-btn id="logout-button" flat round small @click="logout">
        Logout
      </v-btn>
    </v-flex>
  </v-layout>
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
.header {
  background: $color-green;
  background-image: url('../../assets/logo_header.png');
  background-size: 40% auto;
  background-repeat: no-repeat;
  background-position: center center;
}

#logout-button {
  background-color: $color-orange;
  color: white;
}
</style>
