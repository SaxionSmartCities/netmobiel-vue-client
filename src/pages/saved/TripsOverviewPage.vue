<template>
  <content-pane id="scroll">
    <template v-slot:header>
      <tab-bar
        v-if="showTabs"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template v-slot:firstTab>
          <v-icon color="white">commute</v-icon>
          <span>
            Reizen
            <sup>{{ getPlannedTripsCount }}</sup>
          </span>
        </template>

        <template v-slot:secondTab>
          <v-icon color="white">directions_car</v-icon>
          <span>
            Ritten
            <sup>{{ getPlannedRidesCount }}</sup>
          </span>
        </template>
      </tab-bar>
    </template>
    <v-row
      v-if="(showTabs && selectedTab === 0) || isPassenger"
      class="fill-height"
      dense
    >
      <v-col v-if="getPlannedTrips.length === 0">
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
    <v-row v-if="(showTabs && selectedTab === 1) || isDriver" dense>
      <v-col v-if="getPlannedRides.length === 0">
        U heeft geen bewaarde ritten. Ga naar ritten om een nieuwe rit te
        plannen.
      </v-col>
      <v-col v-else>
        <v-row v-for="(ride, index) in getPlannedRides" :key="index">
          <v-col class="py-1">
            <ride-card
              :index="index"
              :ride="ride"
              @rideSelected="onRideSelected"
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
import constants from '../../constants/constants'
import TabBar from '../../components/common/TabBar'
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'

export default {
  name: 'TripsOverviewPage',
  components: { TabBar, ContentPane, TravelCard, RideCard },
  data() {
    return {
      selectedTab: 0,
      bottom: false,
      maxResults: constants.fetchTripsMaxResults,
    }
  },
  computed: {
    ...mapGetters({
      getPlannedTripsCount: 'is/getPlannedTripsCount',
      getPlannedTrips: 'is/getPlannedTrips',
      getPlannedRidesCount: 'cs/getPlannedRidesCount',
      getPlannedRides: 'cs/getRides',
    }),
    showTabs() {
      const role = this.$store.getters['ps/getProfile'].userRole
      return !role || role === 'both'
    },
    isPassenger() {
      const role = this.$store.getters['ps/getProfile'].userRole
      return role === 'passenger'
    },
    isDriver() {
      const role = this.$store.getters['ps/getProfile'].userRole
      return role === 'driver'
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        if (this.selectedTab === 0) {
          this.fetchTrips()
        } else if (this.selectedTab === 1) {
          this.fetchRides()
        }
      }
    },
  },
  beforeRouteEnter: beforeRouteEnter({
    selectedTab: number => {
      return number || 0
    },
  }),
  beforeRouteLeave: beforeRouteLeave({
    selectedTab: number => number || 0,
  }),
  mounted() {
    this.fetchTrips()
    this.fetchRides()
    document
      .getElementById('content-container')
      .addEventListener('scroll', () => {
        this.bottom = this.bottomVisible(
          document.getElementById('content-container')
        )
      })
  },
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
    fetchTrips() {
      this.$store.dispatch('is/fetchTrips', {
        maxResults: this.maxResults,
        offset: this.getPlannedTrips.length,
      })
    },
    fetchRides() {
      this.$store.dispatch('cs/fetchRides', {
        offset: this.getPlannedRides.length,
        maxResults: this.maxResults,
      })
    },
    onTripSelected(index) {
      this.$store.commit('is/setSelectedTrip', this.getPlannedTrips[index])
      this.$router.push('/tripDetailPage')
    },
    onRideSelected(index) {
      const ride = this.getPlannedRides[index]
      this.$router.push({
        name: 'rideDetailPage',
        params: { ride, id: ride.id },
      })
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
