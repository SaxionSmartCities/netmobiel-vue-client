<template>
  <content-pane id="scroll">
    <template v-slot:header>
      <v-tabs
        v-if="showTabs"
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
            <sup>{{ getPlannedTripsCount }}</sup>
          </span>
        </v-tab>
        <v-tab class="white--text no-caps saved">
          <v-icon color="white">directions_car</v-icon>
          <span>
            Ritten
            <sup>{{ getPlannedRidesCount }}</sup>
          </span>
        </v-tab>
      </v-tabs>
    </template>
    <v-row>
      <v-col>
        <v-radio-group v-model="tripsSearchTime" class="mt-1" row>
          <v-radio label="Afgelopen" value="Past"></v-radio>
          <v-radio label="Toekomstige" value="Future"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row v-if="tripsSearchTime === 'Past'">
      <v-col class="past-rides-column py-0">
        <travel-card
          v-for="(trip, index) in getPastTrips"
          class="trip-card"
          :key="index"
          :index="index"
          :from="trip.from"
          :to="trip.to"
          :arrival-time="parseDate(trip.arrivalTime)"
          :departure-time="parseDate(trip.departureTime)"
          :legs="trip.legs"
          @onTripSelected="startReview()"
        />
      </v-col>
    </v-row>
    <template v-if="tripsSearchTime === 'Future'">
      <v-row
        v-if="(showTabs && selectedTab == 0) || isPassenger"
        class="fill-height"
        dense
      >
        <v-col v-if="getPlannedTrips.length == 0">
          U heeft geen bewaarde reizen. Ga naar de planner om uw reis te
          plannen.
        </v-col>
        <v-col v-else>
          <v-row v-for="(trip, index) in getPlannedTrips" :key="index">
            <v-col>
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
      <v-row v-if="(showTabs && selectedTab == 1) || isDriver" dense>
        <v-col v-if="getPlannedRides.length == 0">
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
    </template>
  </content-pane>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/search-results/TravelCard.vue'
import RideCard from '@/components/rides/RideCard.vue'
import constants from '../../constants/constants'
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'

export default {
  name: 'TripsOverviewPage',
  components: { ContentPane, TravelCard, RideCard },
  data() {
    return {
      selectedTab: 0,
      bottom: false,
      maxResults: constants.fetchTripsMaxResults,
      maxResultsPastTrips: constants.fetchTripsMaxResults,
      tripsSearchTime: 'Past',
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
      return !role || role == 'both'
    },
    isPassenger() {
      const role = this.$store.getters['ps/getProfile'].userRole
      return role == 'passenger'
    },
    isDriver() {
      const role = this.$store.getters['ps/getProfile'].userRole
      return role == 'driver'
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        if (this.selectedTab == 0) {
          this.fetchTrips()
        } else if (this.selectedTab == 1) {
          this.fetchRides()
        }
      }
    },
  },
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
    startReview() {
      this.$router.push({ name: 'reviewDriver' })
    },
    fetchTrips() {
      this.$store.dispatch('is/fetchTrips', {
        maxResults: this.maxResults,
        offset: this.getPlannedTrips.length,
      })
    },
    fetchPastTrips() {
      // const date = moment(Date.now()).format('YYYY-MM-DD')
      this.$store.dispatch('is/fetchTrips', {
        pastTrips: true,
        maxResults: this.maxResultsPastTrips,
        until: '2020-04-21T14:00:00+01:00',
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
