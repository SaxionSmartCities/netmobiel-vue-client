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
    <v-row v-if="(showTabs && selectedTab === 0) || isPassenger">
      <v-col class="px-0">
        <v-row dense>
          <v-col>
            <v-radio-group v-model="tripsSearchTime" class="mt-1" row>
              <v-radio label="Geplande reizen" value="Future"></v-radio>
              <v-radio label="Afgelopen reizen" value="Past"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <div style="height: 70%">...</div>
        <v-row v-if="tripsSearchTime === 'Past'">
          <v-col v-if="getPastTrips.length === 0">
            U heeft nog niet meegereden.
          </v-col>
          <v-col v-else class="past-rides-column py-0">
            <travel-card
              v-for="(trip, index) in getPastTrips"
              :key="index"
              class="trip-card"
              :needs-review="needsReview(trip)"
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
        <v-row v-if="tripsSearchTime === 'Future'">
          <v-col v-if="getPlannedTrips.length === 0">
            U heeft geen bewaarde reizen. Ga naar de planner om uw reis te
            plannen.
          </v-col>
          <v-col class="past-rides-column py-0">
            <travel-card
              v-for="(trip, index) in getPlannedTrips"
              :key="index"
              class="trip-card"
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
      <v-col class="past-rides-column pa-0">
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
      maxResultsPastTrips: constants.fetchPastTripsMaxResults,
      tripsSearchTime: 'Future',
    }
  },
  computed: {
    ...mapGetters({
      getPlannedTripsCount: 'is/getPlannedTripsCount',
      getPlannedTrips: 'is/getPlannedTrips',
      getPastTripsCount: 'is/getPastTripsCount',
      getPastTrips: 'is/getPastTrips',
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
          this.tripsSearchTime === 'Future'
            ? this.fetchTrips(this.getPlannedTrips.length)
            : this.fetchPastTrips(this.getPastTripsCount)
        } else if (this.selectedTab === 1) {
          this.fetchRides(this.getPlannedRides.length)
        }
      }
    },
  },
  beforeRouteEnter: beforeRouteEnter({
    selectedTab: number => number || 0,
    tripsSearchTime: searchtime => searchtime || 'Future',
  }),
  beforeRouteLeave: beforeRouteLeave({
    selectedTab: number => number || 0,
    tripsSearchTime: searchtime => searchtime,
  }),
  mounted() {
    this.fetchTrips()
    this.fetchPastTrips()
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
    needsReview(trip) {
      //TODO: Base this on the status for the trip.
      return !!trip.legs.find(l => l.traverseMode == 'RIDESHARE')
    },
    bottomVisible(element) {
      const scrollY = element.scrollTop
      const visible = element.clientHeight
      const pageHeight = element.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    fetchTrips(offset = 0) {
      this.$store.dispatch('is/fetchTrips', {
        maxResults: this.maxResults,
        offset: offset,
      })
    },
    fetchPastTrips(offset = 0) {
      this.$store.dispatch('is/fetchTrips', {
        pastTrips: true,
        maxResults: offset + this.maxResultsPastTrips,
        offset: offset,
        sortDir: 'DESC',
        since: moment()
          .subtract(1, 'week')
          .format(),
        until: moment().format(),
      })
    },
    fetchRides(offset = 0) {
      this.$store.dispatch('cs/fetchRides', {
        offset: offset,
        maxResults: this.maxResults,
      })
    },
    onTripSelected(index) {
      let tripId
      if (this.tripsSearchTime === 'Future') {
        tripId = this.getPlannedTrips[index].id
      } else {
        tripId = this.getPastTrips[index].id
      }
      this.$store.dispatch('is/fetchTrip', { id: tripId })
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
.trip-card {
  margin: 4px 0;
}
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
