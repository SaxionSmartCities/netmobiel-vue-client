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

        <v-btn flat value="search-trip" @click="routeToMode()">
          <span>Planner</span>
          <v-icon>commute</v-icon>
        </v-btn>

        <v-btn flat value="saved" to="/tripsOverviewPage">
          <span>Bewaard</span>
          <v-icon>favorite</v-icon>
        </v-btn>

        <v-btn flat value="community" disabled>
          <span>Community</span>
          <v-icon>chat</v-icon>
        </v-btn>

        <v-btn flat value="profile" to="/profile">
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
  methods: {
    routeToMode: function() {
      // TODO: Link this to profile so we know where to route!
      this.$router.push('/modeSelection')
    },
  },
}
</script>

<style lang="scss"></style>
