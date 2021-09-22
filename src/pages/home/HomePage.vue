<template>
  <content-pane>
    <v-row align="center">
      <v-col cols="3" class="px-0 mr-2">
        <round-user-image
          :image-size="92"
          :avatar-size="100"
          :profile-image="profileImage"
        />
      </v-col>
      <v-col>
        <h1>
          {{ timeOfDayGreeting }},
          {{ fullName }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-1 pt-0">
        <span>
          Welkom bij Netmobiel, dé mobiliteitsapp van de Achterhoek en
          omstreken.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="px-1">
        <v-btn large rounded block outlined color="primary" to="/howTo">
          Hoe werkt het?
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="updateMessages.length > 0">
      <v-col class="px-1">
        <v-row>
          <v-col>
            <h4 class="netmobiel">Updates ({{ updateMessages.length }})</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <update-card :update-message="updateMessages[0]"></update-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!isDrivingPassenger" class="px-1 pb-0">
        <h4 class="netmobiel">Jouw ritten</h4>
      </v-col>
      <v-col v-else class="px-1 pb-0">
        <h4 class="netmobiel">Jouw autoritten</h4>
      </v-col>
    </v-row>
    <v-row v-if="isDriverOnly || isDrivingPassenger" class="py-0">
      <v-col v-if="rides.length === 0" class="py-0 px-1">
        <span class="font-italic">
          Je hebt nog geen autoritten gepland.
        </span>
      </v-col>
      <v-col v-else class="pt-0">
        <v-row v-for="ride in rides" :key="ride.id" xs12>
          <v-col class="px-1 py-0">
            <ride-card class="my-2" :ride="ride" @rideSelected="onRideSelected">
            </ride-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="isDrivingPassenger" class="px-1 pb-0">
        <h4 class="netmobiel">Jouw ritten</h4>
      </v-col>
    </v-row>
    <v-row v-if="isPassengerOnly || isDrivingPassenger" class="py-0">
      <v-col v-if="trips.length === 0" class="py-0 px-1">
        <span class="font-italic">
          Je hebt nog geen ritten gepland.
        </span>
      </v-col>
      <v-col v-else class="pt-0">
        <v-row v-for="trip in trips" :key="trip.id" xs12>
          <v-col class="px-1 py-0">
            <travel-card
              :trip-id="trip.id"
              :itinerary="trip.itinerary"
              class="trip-card"
              @on-trip-selected="onTripSelected"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="rides.length === 0 && trips.length === 0">
      <v-col class="px-1">
        <v-btn
          large
          rounded
          block
          depressed
          color="button"
          @click="routeToMode()"
        >
          Direct aan de slag!
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-btn
          large
          rounded
          block
          outlined
          color="primary"
          to="/tripsOverviewPage"
        >
          Bekijk alle activiteiten
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/cards/TravelCard.vue'
import RideCard from '@/components/cards/RideCard.vue'
import UpdateCard from '@/components/cards/UpdateCard.vue'
import RoundUserImage from '@/components/common/RoundUserImage'
import moment from 'moment'
import constants from '@/constants/constants'
import * as uiStore from '@/store/ui'
import * as chsStore from '@/store/charity-service'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'

export default {
  components: {
    ContentPane,
    TravelCard,
    RideCard,
    UpdateCard,
    RoundUserImage,
  },
  data() {
    return {}
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    fullName() {
      const { firstName, lastName } = this.profile
      return `${firstName} ${lastName}`
    },
    rides() {
      return csStore.getters.getRides
        .filter(ride => ride.state !== 'CANCELLED')
        .slice(0, 2)
    },
    trips() {
      return isStore.getters.getPlannedTrips
        .filter(trip => trip.state !== 'CANCELLED')
        .slice(0, 2)
    },
    timeOfDayGreeting() {
      let currentHour = moment().format('HH')

      if (currentHour < 12) {
        return 'Goedemorgen'
      } else if (currentHour < 18) {
        return 'Goedemiddag'
      } else {
        return 'Goedenavond'
      }
    },
    updateMessages() {
      return uiStore.getters.getUpdateMessages
    },
    profileImage() {
      return this.profile.image
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
    profile(newProfile, oldProfile) {
      if (newProfile.userRole !== oldProfile.userRole) {
        this.fetchTripsAndRides()
      }
    },
  },
  mounted() {
    this.fetchTripsAndRides()
  },
  methods: {
    fetchTripsAndRides() {
      //TODO: How many cards do we want? Get enough to skip the cancelled rides and trips
      const maxCards = 8
      if (this.isDriverOnly || this.isDrivingPassenger) {
        csStore.actions.fetchRides({
          offset: 0,
          maxResults: maxCards,
          since: moment().format(),
        })
      }
      if (this.isPassengerOnly || this.isDrivingPassenger) {
        isStore.actions.fetchTrips({
          offset: 0,
          maxResults: maxCards,
          since: moment().format(),
        })
      }
    },
    onTripSelected(selected) {
      //TODO Use trips from the list (less detailed, then immediate result on page change)
      isStore.mutations.setSelectedTrip({})
      this.$router.push({
        name: 'tripDetailPage',
        params: { tripId: String(selected.tripId) },
      })
    },
    onRideSelected(id) {
      this.$router.push({
        name: 'rideDetailPage',
        params: { rideId: id },
      })
    },
    routeToMode() {
      let newRoute = ''
      if (this.profile.userRole === constants.PROFILE_ROLE_PASSENGER) {
        newRoute = '/search'
      } else if (this.profile.userRole === constants.PROFILE_ROLE_DRIVER) {
        newRoute = '/plan'
      } else {
        newRoute = '/modeSelection'
      }
      // We cannot route to the same page.
      if (this.$router.currentRoute.path !== newRoute) {
        this.$router.push(newRoute)
      }
    },
  },
}
</script>

<style lang="scss">
h4.netmobiel {
  text-transform: uppercase;
  color: $color-primary;
}
</style>
