<template>
  <div>
    <v-tabs id="tabs" grow centered slider-color="#bddade">
      <v-tab class="white--text no-caps saved">
        <v-icon color="white">commute</v-icon>
        <span>Reizen</span>
      </v-tab>
      <v-tab class="white--text no-caps saved">
        <v-icon color="white">directions_car</v-icon>
        <span>Ritten</span>
      </v-tab>
    </v-tabs>
    <v-container>
      <v-layout column>
        <v-flex v-if="getPlannedTrips.length == 0" my-4>
          Helaas, er zijn geen bewaarde ritten gevonden!
        </v-flex>
        <v-flex v-for="(trip, index) in getPlannedTrips" :key="index">
          <travel-card
            class="mt-2 mb-2"
            :from="trip.from"
            :to="trip.to"
            :date="trip.date"
            :journey="trip.itinerary"
          >
          </travel-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
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

<style lang="scss">
.saved {
  background-color: $color-green;
}
.saved span {
  padding: 10px;
}
.no-caps {
  text-transform: none;
}
</style>
