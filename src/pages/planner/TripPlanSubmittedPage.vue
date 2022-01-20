<template>
  <content-pane>
    <v-row class="ma-auto mt-2">
      <v-col>
        <h1>Rit gepland! 🎉</h1>
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        Jouw rit is bevestigd. We sturen je een herinnering voor jouw vertrek.
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
          @click="onPlanReturnTrip()"
        >
          Plan direct je terugrit
        </v-btn>
        <v-btn
          large
          block
          rounded
          depressed
          outlined
          color="primary"
          @click="onPlanNewTrip()"
        >
          Plan een nieuwe rit
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as gsStore from '@/store/geocoder-service'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'TripPlanSubmittedPage',
  components: { ContentPane },
  data() {
    return {}
  },
  methods: {
    onPlanReturnTrip() {
      gsStore.mutations.swapLocations()
      // Criteria are not erased by 'search', because this page is whitelisted
      this.$router.push('/search')
    },
    onPlanNewTrip() {
      // Clear the previous criteria, otherwise old info remains there (because of whitelisting)
      gsStore.mutations.clearAllGeoLocationPicked()
      isStore.mutations.setSearchCriteria({})
      this.$router.push('/search')
    },
  },
}
</script>

<style lang="scss"></style>
