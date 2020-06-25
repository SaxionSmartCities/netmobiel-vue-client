<template>
  <content-pane>
    <v-row class="ma-auto mt-2">
      <v-col>
        <h1>Reis gepland! 🎉</h1>
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        Jouw reis is bevestigd. We sturen je een herinnering voor jouw vertrek.
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        <v-btn
          block
          rounded
          depressed
          class="my-3 button"
          @click="swapLocations()"
        >
          Plan direct je terugreis
        </v-btn>
        <v-btn block rounded depressed outlined color="primary" to="/plan">
          Plan een nieuwe reis
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
export default {
  name: 'TripPlanSubmitted',
  data() {
    return {}
  },
  methods: {
    swapLocations() {
      this.$store.commit('gs/swapLocations')
      this.$router.push('/search')
    },
  },
}
</script>

<style lang="scss"></style>
