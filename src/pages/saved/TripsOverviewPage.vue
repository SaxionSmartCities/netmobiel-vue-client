<template>
  <content-pane id="scroll">
    <template v-slot:header>
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
    </template>
    <v-row v-if="selectedTab == 0" class="fill-height" dense>
      <v-col v-if="getPlannedTrips.length == 0">
        U heeft geen bewaarde reizen. Ga naar de planner om uw reis te plannen.
      </v-col>
      <v-col v-else>
        <v-row v-for="(trip, index) in getPlannedTrips" :key="index">
          <v-col class="py-1">
            <travel-card
              :index="index"
              :from="trip.from"
              :to="trip.to"
              :arrival-time="parseDate(trip.arrivalTime)"
              :departure-time="parseDate(trip.departureTime)"
              :legs="trip.legs"
              @onTripSelected="onTripSelected"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="selectedTab == 1" dense>
      <v-col v-if="getPlannedRides.length == 0">
        U heeft geen bewaarde ritten. Ga naar ritten om een nieuwe rit te
        plannen.
      </v-col>
      <v-col v-else>
        <v-row v-for="(ride, index) in getPlannedRides" :key="index">
          <v-col class="py-1">
            <ride-card
              :from="ride.fromPlace"
              :to="ride.toPlace"
              :date="parseDate(ride.departureTime)"
              :ride="ride"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/search-results/TravelCard.vue'
import RideCard from '@/components/rides/RideCard.vue'

import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'

export default {
  name: 'TripsOverviewPage',
  components: { ContentPane, TravelCard, RideCard },
  data() {
    return {
      selectedTab: 0,
      bottom: false,
      maxResults: 5,
      offsetTrips: 0,
      offsetRides: 0,
    }
  },
  computed: {
    ...mapGetters({
      getPlannedTrips: 'is/getPlannedTrips',
      getPlannedRides: 'cs/getRides',
    }),
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        if (this.selectedTab == 0) {
          console.log('nieuwe Trips laden!', this.offsetTrips)
          this.$store
            .dispatch('is/fetchTrips', {
              maxResults: this.maxResults,
              offset: this.offsetTrips,
            })
            .then(() => {
              this.offsetTrips += this.maxResults
            })
        } else if (this.selectedTab == 1) {
          console.log('nieuwe Rides laden!', this.offsetRides)
          this.$store
            .dispatch('cs/fetchRides', {
              offset: this.offsetRides,
              maxResults: this.maxResults,
            })
            .then(() => {
              this.offsetRides += this.maxResults
            })
        }
      }
    },
  },
  mounted() {
    this.$store
      .dispatch('is/fetchTrips', {
        maxResults: this.maxResults,
        offset: this.offsetTrips,
      })
      .then(() => {
        this.offsetTrips += this.maxResults
      })

    this.$store
      .dispatch('cs/fetchRides', {
        maxResults: this.maxResults,
        offset: this.offsetRides,
      })
      .then(() => {
        this.offsetRides += this.maxResults
      })

    document
      .getElementById('content-container')
      .addEventListener('scroll', () => {
        this.bottom = this.bottomVisible(
          document.getElementById('content-container')
        )
      })
  },
  beforeRouteEnter: beforeRouteEnter({
    selectedTab: number => number,
  }),
  beforeRouteLeave: beforeRouteLeave({
    selectedTab: number => number,
  }),
  methods: {
    parseDate(dateString) {
      return moment(dateString)
    },
    bottomVisible(element) {
      const scrollY = element.scrollTop
      const visible = element.clientHeight
      const pageHeight = element.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    onTripSelected(index) {
      this.$store.commit('is/setSelectedTrip', this.getPlannedTrips[index])
      this.$router.push('/itineraryDetailPage')
    },
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
