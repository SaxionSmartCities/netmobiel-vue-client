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
    </template>
    <v-row v-if="(showTabs && selectedTab === 0) || isPassenger" dense>
      <v-col class="pa-0">
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
          <v-col v-else class="py-0">
            <grouped-card-list :items="getPastTrips">
              <template v-slot:card="{ item: trip, index }">
                <travel-card
                  class="trip-card"
                  :needs-review="needsReview(trip)"
                  :index="index"
                  :from="trip.from"
                  :to="trip.to"
                  :arrival-time="parseDate(trip.arrivalTime)"
                  :departure-time="parseDate(trip.departureTime)"
                  :duration="trip.itinerary.duration"
                  :legs="trip.itinerary.legs"
                  @onTripSelected="onTripSelected"
                />
              </template>
            </grouped-card-list>
          </v-col>
        </v-row>
        <v-row v-if="tripsSearchTime === 'Future'">
          <v-col v-if="getPlannedTrips.length === 0">
            U heeft geen bewaarde reizen. Ga naar de planner om uw reis te
            plannen.
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list :items="getPlannedTrips">
              <template v-slot:card="{ item: trip, index }">
                <travel-card
                  class="trip-card"
                  :index="index"
                  :from="trip.from"
                  :to="trip.to"
                  :arrival-time="parseDate(trip.itinerary.arrivalTime)"
                  :departure-time="parseDate(trip.itinerary.departureTime)"
                  :duration="trip.itinerary.duration"
                  :legs="trip.itinerary.legs"
                  :disabled="trip.state === 'CANCELLED'"
                  @onTripSelected="onTripSelected"
                />
              </template>
            </grouped-card-list>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="(showTabs && selectedTab === 1) || isDriver" dense>
      <v-col class="pa-0">
        <v-row dense>
          <v-col>
            <v-radio-group v-model="ridesSearchTime" class="mt-1" row>
              <v-radio label="Afgelopen ritten" value="Past"></v-radio>
              <v-radio label="Geplande ritten" value="Future"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="ridesSearchTime === 'Past'">
          <v-col v-if="getPastRides.length === 0">
            <span>
              U heeft nog geen ritten gereden. Ga naar ritten om een nieuwe rit
              te plannen.
            </span>
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list :items="getPastRides" type="ride">
              <template v-slot:card="{ item: ride, index }">
                <ride-card
                  class="trip-card"
                  :index="index"
                  :ride="ride"
                  @rideSelected="onRideSelected"
                />
              </template>
            </grouped-card-list>
          </v-col>
        </v-row>
        <v-row v-if="ridesSearchTime === 'Future'">
          <v-col v-if="getPlannedRides.length === 0" class="py-1">
            <span>
              U heeft nog geen ritten gepland. Ga naar ritten om een nieuwe rit
              te plannen.
            </span>
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list :items="getPlannedRides" type="ride">
              <template v-slot:card="{ item: ride, index }">
                <ride-card
                  class="trip-card"
                  :ride="ride"
                  @rideSelected="onRideSelected"
                />
              </template>
            </grouped-card-list>
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
import GroupedCardList from '@/components/common/GroupedCardList'

export default {
  name: 'TripsOverviewPage',
  components: { GroupedCardList, TabBar, ContentPane, TravelCard, RideCard },
  data() {
    return {
      selectedTab: 0,
      bottom: false,
      maxResults: constants.fetchTripsMaxResults,
      maxResultsPastRides: constants.fetchPastRidesMaxResults,
      maxResultsPastTrips: constants.fetchPastTripsMaxResults,
      tripsSearchTime: 'Future',
      ridesSearchTime: 'Future',
    }
  },
  computed: {
    ...{
      getPlannedTripsCount: () => isStore.getters.getPlannedTripsCount,
      getPlannedTrips: () => isStore.getters.getPlannedTrips,
      getPastTripsCount: () => isStore.getters.getPastTripsCount,
      getPastTrips: () => isStore.getters.getPastTrips,
      getPastRides: () => csStore.getters.getPastRides,
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
          if (this.ridesSearchTime === 'Future') {
            this.fetchRides(this.getPlannedRides.length)
          } else {
            this.fetchPastRides(this.getPastRides.length)
          }
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
    this.fetchPastRides()
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
    fetchPastRides(offset = 0) {
      csStore.actions.fetchRides({
        pastRides: true,
        offset: offset,
        maxResults: this.maxResultsPastRides,
        sortDir: 'DESC',
        since: moment()
          .subtract(1, 'months')
          .format(),
        until: moment().format(),
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
    onRideSelected(id) {
      this.$router.push({
        name: 'rideDetailPage',
        params: { id: String(id) },
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
