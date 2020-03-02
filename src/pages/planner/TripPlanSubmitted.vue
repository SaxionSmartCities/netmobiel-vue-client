<template>
  <v-container>
    <v-layout column justify-center fill-height>
      <v-flex shrink mb-4>
        <h1>Reis gepland! 🎉</h1>
      </v-flex>
      <v-flex shrink>
        Jouw reis is bevestigd. We sturen je een herrinnering voor jouw vertrek.
      </v-flex>
      <v-flex shrink>
        <v-btn block rounded depressed class="my-3 button" to="/planTripBack">
          Plan direct je terugreis</v-btn
        >
        <v-btn block rounded depressed outlined color="primary" to="/plan">
          Plan een nieuwe rit</v-btn
        >
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'TripPlanSubmitted',
  data: function() {
    return {}
  },
}
</script>

<style lang="scss"></style>
