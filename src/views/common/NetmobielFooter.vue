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

        <v-btn flat value="plan-trip" to="/savedRidesPassenger">
          <span>Reizen</span>
          <v-icon>commute</v-icon>
        </v-btn>

        <v-btn flat value="saved" to="/savedRidesDriver">
          <span>Ritten</span>
          <v-icon>drive_eta</v-icon>
        </v-btn>

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
