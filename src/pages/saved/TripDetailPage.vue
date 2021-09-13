<template>
  <content-pane>
    <template v-slot:header>
      <v-row
        v-if="selectedTrip.state === 'CANCELLED'"
        class="cancelled-banner text-center py-1"
        dense
        no-gutters
      >
        <v-col>
          Deze rit is niet meer beschikbaar.
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col class="py-0">
        <trip-details
          :trip="selectedTrip"
          :show-map="showMap"
          @closeMap="showMap = false"
        />
      </v-col>
    </v-row>
    <v-row v-if="!isShoutOut && hasRideShareDriver">
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          @click="contactDriver"
        >
          Stuur bericht naar chauffeur
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!isShoutOut">
      <v-col class="pt-0">
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          @click="showFullRouteOnMap()"
        >
          Bekijk op de kaart
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-0">
      <v-col class="pb-0">
        <h3>Wijzigen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <itinerary-options :options="tripOptions" />
      </v-col>
    </v-row>
    <contact-driver-modal
      v-if="showContactDriverModal"
      :show="showContactDriverModal"
      :users="drivers"
      @select="onDriverSelectForMessage"
      @close="showContactDriverModal = false"
    ></contact-driver-modal>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import TripDetails from '@/components/itinerary-details/TripDetails.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import ContactDriverModal from '@/components/itinerary-details/ContactDriverModal'
import travelModes from '@/constants/travel-modes.js'
import { generateItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as uiStore from '@/store/ui'
import * as msStore from '@/store/message-service'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'TripDetailPage',
  components: {
    ContactDriverModal,
    ContentPane,
    TripDetails,
    ItineraryOptions,
  },
  props: {
    tripId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showMap: false,
      showContactDriverModal: false,
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    isShoutOut() {
      return false
    },
    hasRideShareDriver() {
      return this.getRideShareDriverId !== null
    },
    drivers() {
      return this.selectedTrip.legs
        .filter(leg => leg.traverseMode === 'RIDESHARE')
        .map(leg => {
          return {
            name: leg.driverName,
            id: leg.driverId,
            // context: leg.bookingId ? leg.bookingId : leg.tripId,
            context: leg.tripId,
            contextText: `Meerijden ${this.formatTime(leg.startTime)} van ${
              leg.from.label
            } naar ${leg.to.label}`,
          }
        })
    },
    getRideShareDriverId() {
      return this.drivers.length > 0 ? this.drivers[0].id : null
    },
    selectedTrip() {
      let trip = isStore.getters.getSelectedTrip
      trip.legs = generateItineraryDetailSteps(trip.itinerary)
      return trip
    },
    tripOptions() {
      let options = []
      const { state } = this.selectedTrip
      const legs = this.selectedTrip?.itinerary?.legs
      const found = legs ? legs.find(l => l.confirmed !== undefined) : undefined
      switch (state) {
        case 'SCHEDULED':
          options.push({
            icon: 'fa-pencil-alt',
            label: 'Wijzig deze rit',
            callback: this.onTripEdit,
          })
          options.push({
            icon: 'fa-times-circle',
            label: 'Annuleer deze rit',
            callback: this.onTripCancelled,
          })
          break
        case 'VALIDATING':
          if (found === undefined) {
            options.push({
              icon: 'fa-check-circle',
              label: 'Bevestig deze rit',
              callback: this.onTripReview,
            })
          }
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onTripReplan,
          })
          break
        case 'COMPLETED':
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onTripReplan,
          })
          options.push({
            icon: 'fa-times-circle',
            label: 'Verwijder deze rit',
            callback: this.onTripCancelled,
          })
          break
        case 'CANCELLED':
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onTripReplan,
          })
          options.push({
            icon: 'fa-times-circle',
            label: 'Verwijder deze rit',
            callback: this.onTripCancelled,
          })
      }
      return options
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    if (this.tripId) {
      isStore.actions.fetchTrip({ id: this.tripId })
    }
  },
  methods: {
    formatTime(t) {
      return t
        ? moment(t)
            .locale('nl')
            .calendar()
        : '- - : - -'
    },
    saveTrip() {
      const selectedTrip = isStore.getters.getSelectedTrip
      isStore.actions
        .createTrip(selectedTrip)
        .then(() => this.$router.push('/tripPlanSubmitted'))
    },
    showFullRouteOnMap() {
      this.showMap = true
    },
    contactDriver() {
      const drvs = this.drivers
      if (drvs.length === 0) {
        // eslint-disable-next-line
        console.warn(
          `Expected to find at least one driver in the selected trip!`
        )
      } else if (drvs.length > 1) {
        //Open the modal to select a driver
        this.showContactDriverModal = true
      } else {
        // You can directly push to the router
        this.onDriverSelectForMessage(drvs[0])
      }
    },
    onTripReplan() {
      const { from, to } = this.selectedTrip
      isStore.mutations.setSearchCriteria({ from, to })
      this.$router.push('/search')
    },
    onTripReview(trip) {
      this.$router.push({
        name: 'tripConfirmPage',
        params: { id: this.selectedTrip.id.toString() },
      })
    },
    onTripCancelled() {
      isStore.actions.deleteTrip({
        tripId: this.selectedTrip.id,
        displayWarning: true,
      })
      this.$router.push('/tripCancelledPage')
    },
    onTripEdit() {
      const { from, to, itinerary, arrivalTimeIsPinned } = this.selectedTrip
      const { searchPreferences } = this.profile
      let searchCriteria = {
        from,
        to,
        preferences: searchPreferences,
        travelTime: {
          when: arrivalTimeIsPinned
            ? moment(itinerary.arrivalTime)
            : moment(itinerary.departureTime),
          arriving: arrivalTimeIsPinned,
        },
      }
      isStore.mutations.setSearchCriteria(searchCriteria)
      isStore.actions.searchTripPlan(searchCriteria)
      this.$router.push({
        name: 'searchResults',
        params: { tripId: String(this.selectedTrip.id) },
      })
    },
    onDriverSelectForMessage(driver) {
      // Gets the driver's profile from the rideshare service, we need the managed identity of the driver
      csStore.actions
        .fetchUser({
          userRef: driver.id,
        })
        .then(driverProfile => {
          this.$router.push({
            name: `conversation`,
            params: {
              context: driver.context,
              contextText: driver.contextText,
              participants: [this.profile.id, driverProfile.managedIdentity],
            },
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
