<template>
  <v-container>
    <v-layout column>
      <v-flex><h3>Bewaarde ritten</h3></v-flex>
      <v-flex mt-2>
        <v-divider />
        <v-flex v-if="getPlannedTrips.length == 0" my-4>
          Helaas, er zijn geen bewaarde ritten gevonden!
        </v-flex>
        <v-divider />
      </v-flex>
      <v-flex v-for="(trip, index) in getPlannedTrips" :key="index">
        <travel-card
          class="mt-2"
          :from="trip.from"
          :to="trip.to"
          :date="trip.date"
          :journey="trip.itinerary"
        >
        </travel-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TravelCard from '@/components/search-results/TravelCard.vue'

export default {
  name: 'TripsOverviewPage',
  components: { TravelCard },
  computed: {
    getPlannedTrips() {
      return this.$store.getters['is/getPlannedTrips']
    },
  },
  mounted() {
    this.$store.dispatch('is/fetchTrips')
  },
}
</script>

<style lang="scss"></style>
