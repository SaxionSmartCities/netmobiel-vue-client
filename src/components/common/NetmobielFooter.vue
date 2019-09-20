<template>
  <v-layout fill-height>
    <v-flex>
      <v-bottom-nav
        :active.sync="selectedNav"
        :value="true"
        color="transparant"
      >
        <v-btn flat value="home" to="/home">
          <span>Home</span>
          <v-icon>home</v-icon>
        </v-btn>

        <v-btn flat value="search-trip" to="/search">
          <span>Reis plannen</span>
          <v-icon>commute</v-icon>
        </v-btn>

        <v-btn flat value="plan-trip" to="/plan">
          <span>Ritten</span>
          <v-icon>directions_car</v-icon>
        </v-btn>

        <!-- <v-btn flat value="community">
          <span>Community</span>
          <v-icon>chat</v-icon>
        </v-btn>
        -->

        <v-btn flat value="profile" @click="$router.push('/profile')">
          <span>Profiel</span>
          <v-icon>person</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Footer',
  data: function() {
    return {
      selectedNav: '',
    }
  },
}
</script>

<style lang="scss"></style>
