<template>
  <div>
    <v-tabs
      id="tabs"
      v-model="selectedTab"
      grow
      centered
      slider-color="#bddade"
    >
      <v-tab class="white--text no-caps saved">
        <v-icon color="white">commute</v-icon>
        <span>
          Reizen
          <sup>{{ getPlannedTrips.length }}</sup>
        </span>
      </v-tab>
      <v-tab class="white--text no-caps saved">
        <v-icon color="white">directions_car</v-icon>
        <span>
          Ritten
          <sup>{{ getPlannedRides.length }}</sup>
        </span>
      </v-tab>
    </v-tabs>
    <v-container>
      <v-layout v-if="selectedTab == 0" column>
        <v-flex v-if="getPlannedTrips.length == 0" my-4>
          U heeft geen bewaarde reizen.
          Ga naar de planner om uw reis te plannen.
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
      <v-layout v-if="selectedTab == 1" column>
        <v-flex v-if="getPlannedRides.length == 0" my-4>
          U heeft geen bewaarde ritten.
          Ga naar ritten om een nieuwe rit te plannen.
        </v-flex>
        <v-flex v-for="(ride, index) in getPlannedRides" :key="index">
          <travel-card
            class="mt-2 mb-2"
            :from="ride.fromPlace"
            :to="ride.toPlace"
            :date="parseDate(ride.departureTime)"
            :journey="{ legs:[], duration: 1800 }"
          >
          </travel-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment'
import TravelCard from '@/components/search-results/TravelCard.vue'

export default {
  name: 'TripsOverviewPage',
  components: { TravelCard },
  data() {
    return {
      selectedTab: 0,
    }
  },
  computed: {
    getPlannedTrips() {
      return this.$store.getters['is/getPlannedTrips']
    },
    getPlannedRides() {
      return this.$store.getters['cs/getRides']
    },
  },
  mounted() {
    this.$store.dispatch('is/fetchTrips')
    this.$store.dispatch('cs/fetchRides')
  },
  methods: {
    parseDate(dateString) {
      return moment(dateString).valueOf()
    }
  }
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
