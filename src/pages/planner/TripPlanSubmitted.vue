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
          large
          block
          rounded
          depressed
          class="my-3 button"
          @click="swapLocations()"
        >
          Plan direct je terugreis
        </v-btn>
        <v-btn
          large
          block
          rounded
          depressed
          outlined
          color="primary"
          to="/plan"
        >
          Plan een nieuwe reis
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'

export default {
  name: 'TripPlanSubmitted',
  components: { ContentPane },
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
