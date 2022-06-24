<template>
  <content-pane scrollable @low="onLowWater">
    <template #header>
      <tab-bar
        v-if="isDrivingPassenger"
        class="shrink"
        :selected-tab-model="selectedTab"
        @tabChange="(n) => (selectedTab = n)"
      >
        <template #firstTab>
          <v-icon color="white">directions_car</v-icon>
          <span>
            Chauffeur
            <sup
              v-if="ridesSearchTime === 'Future' && plannedRides.totalCount > 0"
              >{{ plannedRides.totalCount }}</sup
            >
          </span>
        </template>

        <template #secondTab>
          <v-icon color="white">commute</v-icon>
          <span>
            Passagier
            <sup
              v-if="tripsSearchTime === 'Future' && plannedTrips.totalCount > 0"
              >{{ plannedTrips.totalCount }}</sup
            >
          </span>
        </template>
      </tab-bar>
    </template>
    <v-row v-if="isPassengerView" dense>
      <v-col class="pa-1">
        <v-row dense>
          <v-col>
            <v-radio-group v-model="tripsSearchTime" class="mt-1" row>
              <v-radio label="Afgelopen ritten" value="Past"></v-radio>
              <v-radio label="Geplande ritten" value="Future"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="tripsSearchTime === 'Past'" dense>
          <v-col v-if="pastTrips.totalCount === 0" align="center">
            <em>Je hebt nog geen ritten gemaakt.</em>
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list
              :items="pastTrips.data"
              :get-date="(t) => t.itinerary.arrivalTime"
            >
              <template #card="{ item: trip }">
                <travel-card
                  :trip-id="trip.id"
                  :trip-state="trip.state"
                  :itinerary="trip.itinerary"
                  :relative-time="false"
                  class="trip-card"
                  @on-trip-selected="onTripSelected"
                />
              </template>
            </grouped-card-list>
          </v-col>
        </v-row>
        <v-row v-if="tripsSearchTime === 'Future'" dense>
          <v-col v-if="plannedTrips.totalCount === 0">
            Je hebt geen bewaarde ritten. Ga naar de planner om een rit te
            plannen.
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list
              :items="plannedTrips.data"
              :get-date="(t) => t.itinerary.arrivalTime"
            >
              <template #card="{ item: trip }">
                <travel-card
                  :trip-id="trip.id"
                  :trip-state="trip.state"
                  :itinerary="trip.itinerary"
                  :relative-time="false"
                  class="trip-card"
                  @on-trip-selected="onTripSelected"
                />
              </template>
            </grouped-card-list>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="isDriverView" dense>
      <v-col class="pa-1">
        <v-row dense>
          <v-col>
            <v-radio-group v-model="ridesSearchTime" class="mt-1" row>
              <v-radio label="Afgelopen ritten" value="Past"></v-radio>
              <v-radio label="Geplande ritten" value="Future"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="ridesSearchTime === 'Past'" dense>
          <v-col v-if="pastRides.totalCount === 0">
            <span>
              Je hebt nog geen ritten gereden. Ga naar de planner om een nieuwe
              rit te plannen.
            </span>
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list
              :items="pastRides.data"
              :get-date="(r) => r.departureTime"
            >
              <template #card="{ item: ride, index }">
                <ride-card
                  class="trip-card"
                  :index="index"
                  :ride="ride"
                  :relative-time="false"
                  @rideSelected="onRideSelected"
                />
              </template>
            </grouped-card-list>
          </v-col>
        </v-row>
        <v-row v-if="ridesSearchTime === 'Future'" dense>
          <v-col v-if="plannedRides.totalCount === 0" class="py-1">
            <span>
              Je hebt nog geen ritten gepland. Ga naar de planner om een nieuwe
              rit te plannen.
            </span>
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list
              :items="plannedRides.data"
              :get-date="(r) => r.departureTime"
            >
              <template #card="{ item: ride, index }">
                <ride-card
                  class="trip-card"
                  :index="index"
                  :ride="ride"
                  :relative-time="false"
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
import TravelCard from '@/components/cards/TravelCard.vue'
import RideCard from '@/components/cards/RideCard.vue'
import constants from '../../constants/constants'
import TabBar from '../../components/common/TabBar'
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import GroupedCardList from '@/components/common/GroupedCardList'

export default {
  name: 'TripsOverviewPage',
  components: {
    GroupedCardList,
    TabBar,
    ContentPane,
    TravelCard,
    RideCard,
  },
  beforeRouteEnter: beforeRouteEnter({
    selectedTab: (number) => {
      // console.log(`BeforeRouteEnter selectedTab: ${number}`)
      return number || 0
    },
    tripsSearchTime: (searchtime) => searchtime || 'Future',
    ridesSearchTime: (searchtime) => searchtime || 'Future',
  }),
  beforeRouteLeave: beforeRouteLeave({
    selectedTab: (number) => number || 0,
    tripsSearchTime: (searchtime) => searchtime,
    ridesSearchTime: (searchtime) => searchtime,
  }),
  data() {
    return {
      selectedTab: 0,
      maxResults: constants.fetchTripsMaxResults,
      maxResultsPastRides: constants.fetchPastRidesMaxResults,
      maxResultsPastTrips: constants.fetchPastTripsMaxResults,
      tripsSearchTime: 'Future',
      ridesSearchTime: 'Future',
      // Fix the since/until division to the current request time
      requestTime: null,
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    ...{
      plannedTrips: () => isStore.getters.getPlannedTrips,
      pastTrips: () => isStore.getters.getPastTrips,
      plannedRides: () => csStore.getters.getPlannedRides,
      pastRides: () => csStore.getters.getPastRides,
    },
    isDriverTab() {
      return this.selectedTab === 0
    },
    isPassengerTab() {
      return this.selectedTab === 1
    },
    isDriverView() {
      return this.isDriverOnly || (this.isDrivingPassenger && this.isDriverTab)
    },
    isPassengerView() {
      return (
        this.isPassengerOnly || (this.isDrivingPassenger && this.isPassengerTab)
      )
    },
    isPassengerOnly() {
      return this.profile.userRole === constants.PROFILE_ROLE_PASSENGER
    },
    isDriverOnly() {
      return this.profile.userRole === constants.PROFILE_ROLE_DRIVER
    },
    isDrivingPassenger() {
      return this.profile.userRole === constants.PROFILE_ROLE_BOTH
    },
  },
  watch: {
    // selectedTab(newValue, oldValue) {
    //   console.log(`SelectedTab ${oldValue} --> ${newValue}`)
    // },
    // eslint-disable-next-line no-unused-vars
    selectedTab(newValue, oldValue) {
      this.profile.actingRole =
        newValue === 1
          ? constants.PROFILE_ROLE_PASSENGER
          : constants.PROFILE_ROLE_DRIVER
      // No update of profile, too many updates
      // psStore.actions
      //   .updateMyProfile(this.profile)
      //   .then(() => psStore.actions.fetchMyProfile())
    },
  },
  mounted() {
    this.requestTime = moment().format()
    this.selectedTab =
      this.profile.actingRole === constants.PROFILE_ROLE_PASSENGER ? 1 : 0
    if (this.isPassengerOnly || this.isDrivingPassenger) {
      this.fetchPlannedTrips()
      this.fetchPastTrips()
    }
    if (this.isDriverOnly || this.isDrivingPassenger) {
      this.fetchPlannedRides()
      this.fetchPastRides()
    }
  },
  methods: {
    parseDate(dateString) {
      return moment(dateString)
    },
    needsReview(trip) {
      //TODO: Base this on the status for the trip.
      if (trip?.legs) {
        return trip.legs.find((l) => l.traverseMode === 'RIDESHARE')
      }
      return false
    },
    fetchPlannedTrips(offset = 0) {
      if (offset === 0 || offset < this.plannedTrips.totalCount) {
        isStore.actions.fetchPlannedTrips({
          maxResults: this.maxResults,
          offset: offset,
          since: this.requestTime,
        })
      }
    },
    fetchPastTrips(offset = 0) {
      if (offset === 0 || offset < this.pastTrips.totalCount) {
        isStore.actions.fetchPastTrips({
          maxResults: this.maxResultsPastTrips,
          offset: offset,
          sortDir: 'DESC',
          until: this.requestTime,
        })
      }
    },
    fetchPlannedRides(offset = 0) {
      if (offset === 0 || offset < this.plannedRides.totalCount) {
        csStore.actions.fetchPlannedRides({
          offset: offset,
          maxResults: this.maxResults,
          since: this.requestTime,
        })
      }
    },
    fetchPastRides(offset = 0) {
      if (offset === 0 || offset < this.pastRides.totalCount) {
        csStore.actions.fetchPastRides({
          offset: offset,
          maxResults: this.maxResultsPastRides,
          sortDir: 'DESC',
          until: this.requestTime,
        })
      }
    },
    onTripSelected(selected) {
      //TODO Why is the trip cleared?
      isStore.mutations.setSelectedTrip(null)
      this.$router.push({
        name: 'tripDetailPage',
        params: { tripId: String(selected.tripId) },
      })
    },
    onRideSelected(id) {
      this.$router.push({
        name: 'rideDetailPage',
        params: { rideId: String(id) },
      })
    },
    onLowWater() {
      if (this.isPassengerView) {
        if (this.tripsSearchTime === 'Future') {
          this.fetchPlannedTrips(this.plannedTrips.data.length)
        } else {
          this.fetchPastTrips(this.pastTrips.data.length)
        }
      } else if (this.isDriverView) {
        if (this.ridesSearchTime === 'Future') {
          this.fetchPlannedRides(this.plannedRides.data.length)
        } else {
          this.fetchPastRides(this.pastRides.data.length)
        }
      }
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
