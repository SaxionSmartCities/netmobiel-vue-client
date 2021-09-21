<template>
  <content-pane id="scroll">
    <template v-slot:header>
      <tab-bar
        v-if="isDrivingPassenger"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template v-slot:firstTab>
          <v-icon color="white">directions_car</v-icon>
          <span>
            Chauffeur
            <sup>{{
              ridesSearchTime === 'Future'
                ? getPlannedRidesCount
                : getPastRidesCount
            }}</sup>
          </span>
        </template>

        <template v-slot:secondTab>
          <v-icon color="white">commute</v-icon>
          <span>
            Passagier
            <sup>{{
              tripsSearchTime === 'Future'
                ? getPlannedTripsCount
                : getPastTripsCount
            }}</sup>
          </span>
        </template>
      </tab-bar>
      <slide-show-cancelled-trips
        v-if="isPassengerView && getCancelledTrips.length > 0"
        :trips="getCancelledTrips"
      >
        <template v-slot:card="{ trip }">
          <travel-card
            :trip-id="trip.id"
            :itinerary="trip.itinerary"
            class="trip-card"
            @on-trip-selected="onTripSelected"
          />
        </template>
      </slide-show-cancelled-trips>
    </template>
    <v-row v-if="isPassengerView" dense>
      <v-col class="pa-0">
        <v-row dense>
          <v-col>
            <v-radio-group v-model="tripsSearchTime" class="mt-1" row>
              <v-radio label="Afgelopen ritten" value="Past"></v-radio>
              <v-radio label="Geplande ritten" value="Future"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row v-if="tripsSearchTime === 'Past'">
          <v-col v-if="getPastTrips.length === 0" align="center">
            <em>U heeft nog geen ritten gemaakt.</em>
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list :items="getPastTrips">
              <template v-slot:card="{ item: trip }">
                <travel-card
                  :trip-id="trip.id"
                  :trip-state="trip.state"
                  :itinerary="trip.itinerary"
                  class="trip-card"
                  @on-trip-selected="onTripSelected"
                />
              </template>
            </grouped-card-list>
          </v-col>
        </v-row>
        <v-row v-if="tripsSearchTime === 'Future'">
          <v-col v-if="getPlannedTrips.length === 0">
            U heeft geen bewaarde ritten. Ga naar de planner om uw rit te
            plannen.
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list :items="getPlannedTrips">
              <template v-slot:card="{ item: trip }">
                <travel-card
                  :trip-id="trip.id"
                  :trip-state="trip.state"
                  :itinerary="trip.itinerary"
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
              U heeft nog geen ritten gereden. Ga naar de planner om een nieuwe
              rit te plannen.
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
              U heeft nog geen ritten gepland. Ga naar de planner om een nieuwe
              rit te plannen.
            </span>
          </v-col>
          <v-col v-else class="py-0">
            <grouped-card-list :items="getPlannedRides" type="ride">
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
import SlideShowCancelledTrips from '@/components/other/SlideShowCancelledTrips'
import GroupedCardList from '@/components/common/GroupedCardList'
import { isBottomVisible } from '@/utils/scroll'

export default {
  name: 'TripsOverviewPage',
  components: {
    GroupedCardList,
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
      maxResultsPastRides: constants.fetchPastRidesMaxResults,
      maxResultsPastTrips: constants.fetchPastTripsMaxResults,
      tripsSearchTime: 'Future',
      ridesSearchTime: 'Future',
      scrollHandler: () => {
        this.bottom = isBottomVisible()
      },
    }
  },
  computed: {
    ...{
      getPlannedTripsCount: () => isStore.getters.getPlannedTripsCount,
      getPlannedTrips: () => isStore.getters.getPlannedTrips,
      getPastTripsCount: () => isStore.getters.getPastTripsCount,
      getPastTrips: () => isStore.getters.getPastTrips,
      getCancelledTrips: () => isStore.getters.getCancelledTrips,
      getPastRides: () => csStore.getters.getPastRides,
      getPastRidesCount: () => csStore.getters.getPastRidesCount,
    },
    getPlannedRidesCount() {
      return csStore.getters.getPlannedRidesCount
    },
    getPlannedRides() {
      return csStore.getters.getRides
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
      return (
        psStore.getters.getProfile.userRole === constants.PROFILE_ROLE_PASSENGER
      )
    },
    isDriverOnly() {
      return (
        psStore.getters.getProfile.userRole === constants.PROFILE_ROLE_DRIVER
      )
    },
    isDrivingPassenger() {
      return psStore.getters.getProfile.userRole === constants.PROFILE_ROLE_BOTH
    },
  },
  watch: {
    // selectedTab(newValue, oldValue) {
    //   console.log(`SelectedTab ${oldValue} --> ${newValue}`)
    // },
    bottom(bottom) {
      if (bottom) {
        if (this.isPassengerView) {
          if (this.tripsSearchTime === 'Future') {
            this.fetchTrips(this.getPlannedTrips.length)
          } else {
            this.fetchPastTrips(this.getPastTrips.length)
          }
        } else if (this.isDriverView) {
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
    selectedTab: number => {
      // console.log(`BeforeRouteEnter selectedTab: ${number}`)
      return number || 0
    },
    tripsSearchTime: searchtime => searchtime || 'Future',
    ridesSearchTime: searchtime => searchtime || 'Future',
  }),
  beforeRouteLeave: beforeRouteLeave({
    selectedTab: number => number || 0,
    tripsSearchTime: searchtime => searchtime,
    ridesSearchTime: searchtime => searchtime,
  }),
  mounted() {
    if (this.isPassengerOnly || this.isDrivingPassenger) {
      this.fetchTrips()
      this.fetchPastTrips()
    }
    if (this.isDriverOnly || this.isDrivingPassenger) {
      this.fetchRides()
      this.fetchPastRides()
    }
    // The logic does not seem to be right for cancelled trips, disable that slide show.
    // isStore.actions.fetchCancelledTrips()
    window.addEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    parseDate(dateString) {
      return moment(dateString)
    },
    needsReview(trip) {
      //TODO: Base this on the status for the trip.
      if (trip?.legs) {
        return trip.legs.find(l => l.traverseMode === 'RIDESHARE')
      }
      return false
    },
    fetchTrips(offset = 0) {
      isStore.actions.fetchTrips({
        maxResults: this.maxResults,
        offset: offset,
        since: moment().format(),
      })
    },
    fetchPastTrips(offset = 0) {
      if (offset === 0 || offset < this.getPastTripsCount) {
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
      if (offset === 0 || offset < this.getPastRidesCount) {
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
      }
    },
    onTripSelected(selected) {
      isStore.mutations.setSelectedTrip({})
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
