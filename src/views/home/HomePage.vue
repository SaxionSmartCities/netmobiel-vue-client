<template>
  <div id="home-page">
    <v-container fill-height>
      <v-layout justify-center column>
        <v-layout align-center justify-center column>
          <h3 class="white--text">Hoi {{ user.name }}</h3>
          <p class="white--text">Welkom bij Netmobiel!</p>
        </v-layout>
        <v-layout align-center justify-start column>
          <v-btn large round class="mb-2 nav-buttons" to="/search">
            Ik wil een reis zoeken!
          </v-btn>
          <v-btn large round class="mb-2 nav-buttons">
            Ik wil een reis aanbieden!
          </v-btn>
          <v-btn large round to="/createUser" class="nav-buttons">
            Ik wil als nog een account aanmaken!
          </v-btn>
        </v-layout>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.getUser
    },
  },
}
</script>

<style lang="scss">
#home-page {
  background-color: $color-green;
  height: 100%;
}
.v-btn {
  text-transform: none;
}
.nav-buttons {
  width: 300px;
}

.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: $color-orange;
  color: white;
}
</style>
