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
          {{ user.fullName }}
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
    <v-row>
      <v-col class="px-1 pt-0">
        <v-btn
          large
          rounded
          block
          outlined
          color="button"
          to="/rideSafeNetmobiel"
        >
          Corona adviezen
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
      <v-col class="px-1 pb-0">
        <h4 class="netmobiel">Jouw activiteiten</h4>
      </v-col>
    </v-row>
    <v-row class="py-0">
      <v-col v-if="rides.length === 0 && trips.length === 0" class="py-0 px-1">
        <v-row dense>
          <v-col class="py-0">
            <span class="font-italic">
              Je hebt nog geen activiteiten gepland.
            </span>
          </v-col>
        </v-row>
        <v-row>
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
      </v-col>
      <v-col v-else class="pt-0">
        <v-row v-for="(ride, index) in rides" :key="index" xs12>
          <v-col class="px-1 py-0">
            <ride-card
              class="my-2"
              :index="index"
              :ride="ride"
              @rideSelected="onRideSelected"
            >
            </ride-card>
          </v-col>
        </v-row>
        <v-row v-for="(trip, index) in trips" :key="index" xs12>
          <v-col class="px-1 py-0">
            <travel-card
              :trip-id="trip.id"
              :itinerary="trip.itinerary"
              class="trip-card"
              @on-trip-selected="onTripSelected"
            />
          </v-col>
        </v-row>
        <v-row>
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
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="5000" type="warning" class="mb-12">
      Lees hier onze corona adviezen
      <v-btn text @click="$router.push({ name: 'rideSafeNetmobiel' })">
        Lees meer
      </v-btn>
    </v-snackbar>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/cards/TravelCard.vue'
import RideCard from '@/components/cards/RideCard.vue'
import UpdateCard from '@/components/cards/UpdateCard.vue'
import RoundUserImage from '@/components/common/RoundUserImage'
import moment from 'moment'
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
    return {
      snackbar: false,
    }
  },
  computed: {
    user() {
      return psStore.getters.getUser
    },
    rides() {
      //HACK: Only display first 3 rides.
      let sortedList = []
      const rides = csStore.getters.getRides
      if (rides) {
        sortedList = rides.slice(0, 3)
        sortedList.sort((a, b) => {
          return new Date(a.departureTime) - new Date(b.departureTime)
        })
      }
      return sortedList
    },
    trips() {
      return isStore.getters.getPlannedTrips.filter(
        trip => trip.state !== 'CANCELLED'
      )
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
      return psStore.getters.getUser.profile.image
    },
  },
  mounted() {
    //TODO: How many cards do we want?
    csStore.actions.fetchRides({ offset: 0, maxResults: 2 })
    isStore.actions.fetchTrips({
      offset: 0,
      maxResults: 2,
      since: moment().format(),
    })
  },
  methods: {
    onTripSelected(selected) {
      isStore.actions.fetchTrip({ id: selected.tripId })
      this.$router.push('/tripDetailPage')
    },
    onRideSelected(id) {
      this.$router.push({
        name: 'rideDetailPage',
        params: { id: String(id) },
      })
    },
    routeToMode() {
      let newRoute = ''
      if (this.user.profile.userRole === 'passenger') {
        newRoute = '/search'
      } else if (this.user.profile.userRole === 'driver') {
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
