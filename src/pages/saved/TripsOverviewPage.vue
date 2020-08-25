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
            <sup>{{
              tripsSearchTime === 'Future'
                ? getPlannedTripsCount
                : getPastTripsCount
            }}</sup>
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
      <slide-show-cancelled-trips
        v-if="
          ((showTabs && selectedTab === 0) || isPassenger) &&
            getCancelledTrips.length > 0
        "
        :trips="getCancelledTrips"
      >
        <template v-slot:card="{ trips }">
          <travel-card
            v-for="(trip, index) in trips"
            :key="index"
            class="trip-card"
            :index="index"
            :from="trip.from"
            :to="trip.to"
            :arrival-time="parseDate(trip.itinerary.arrivalTime)"
            :departure-time="parseDate(trip.itinerary.departureTime)"
            :duration="trip.itinerary.duration"
            :legs="trip.itinerary.legs"
            @onTripSelected="onTripSelected"
          />
        </template>
      </slide-show-cancelled-trips>
    </template>
    <v-row v-if="(showTabs && selectedTab === 0) || isPassenger">
      <v-col class="px-0">
        <v-row dense>
          <v-col>
            <v-radio-group v-model="tripsSearchTime" class="mt-1" row>
              <v-radio label="Afgelopen reizen" value="Past"></v-radio>
              <v-radio label="Geplande reizen" value="Future"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="tripsSearchTime === 'Past'">
          <v-col v-if="getPastTrips.length === 0" align="center">
            <em>U heeft nog geen reizen gemaakt.</em>
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
              :legs="trip.itinerary.legs"
              @onTripSelected="onTripSelected"
            />
          </v-col>
        </v-row>
        <v-row v-if="tripsSearchTime === 'Future'">
          <v-col v-if="getPlannedTrips.length === 0">
            U heeft geen bewaarde reizen. Ga naar de planner om uw reis te
            plannen.
          </v-col>
          <v-col v-else class="past-rides-column py-0">
            <travel-card
              v-for="(trip, index) in getPlannedTrips"
              :key="index"
              class="trip-card"
              :index="index"
              :from="trip.from"
              :to="trip.to"
              :arrival-time="parseDate(trip.itinerary.arrivalTime)"
              :departure-time="parseDate(trip.itinerary.departureTime)"
              :duration="trip.itinerary.duration"
              :legs="trip.itinerary.legs"
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
      <v-col v-else class="past-rides-column pa-0">
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
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/search-results/TravelCard.vue'
import RideCard from '@/components/rides/RideCard.vue'
import constants from '../../constants/constants'
import TabBar from '../../components/common/TabBar'
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import SlideShowCancelledTrips from '@/components/other/SlideShowCancelledTrips'

export default {
  name: 'TripsOverviewPage',
  components: {
    SlideShowCancelledTrips,
    TabBar,
    ContentPane,
    TravelCard,
    RideCard,
  },
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
    ...{
      getPlannedTripsCount: () => isStore.getters.getPlannedTripsCount,
      getPlannedTrips: () =>
        isStore.getters.getPlannedTrips.filter(
          trip => trip.state !== 'CANCELLED'
        ),
      getPastTripsCount: () => isStore.getters.getPastTripsCount,
      getPastTrips: () => isStore.getters.getPastTrips,
    },
    getPlannedRidesCount() {
      return csStore.getters.getPlannedRidesCount
    },
    getPlannedRides() {
      return csStore.getters.getRides
    },
    showTabs() {
      const role = psStore.getters.getProfile.userRole
      return !role || role === 'both'
    },
    isPassenger() {
      const role = psStore.getters.getProfile.userRole
      return role === 'passenger'
    },
    isDriver() {
      const role = psStore.getters.getProfile.userRole
      return role === 'driver'
    },
    getCancelledTrips() {
      return isStore.getters.getPlannedTrips.filter(
        trip => trip.state === 'CANCELLED'
      )
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        if (this.selectedTab === 0) {
          if (this.tripsSearchTime === 'Future') {
            this.fetchTrips(this.getPlannedTrips.length)
          } else {
            this.fetchPastTrips(this.getPastTrips.length)
          }
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
      if (trip?.legs) {
        return trip.legs.find(l => l.traverseMode == 'RIDESHARE')
      }
      return false
    },
    bottomVisible(element) {
      const scrollY = element.scrollTop
      const visible = element.clientHeight
      const pageHeight = element.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    fetchTrips(offset = 0) {
      isStore.actions.fetchTrips({
        maxResults: this.maxResults,
        offset: offset,
        since: moment().format(),
      })
    },
    fetchPastTrips(offset = 0) {
      if (offset == 0 || offset < this.getPastTripsCount) {
        isStore.actions.fetchTrips({
          pastTrips: true,
          maxResults: this.maxResultsPastTrips,
          offset: offset,
          sortDir: 'DESC',
          until: moment().format(),
        })
      }
    },
    fetchRides(offset = 0) {
      csStore.actions.fetchRides({
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
      isStore.actions.fetchTrip({ id: tripId })
      this.$router.push('/tripDetailPage')
    },
    onRideSelected(index) {
      const ride = this.getPlannedRides[index]
      this.$router.push({
        name: 'rideDetailPage',
        params: { ride, id: ride.id.toString() },
      })
    },
  },
}
</script>

<style lang="scss">
.trip-card {
  margin: 0;
  margin-bottom: 8px;
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
