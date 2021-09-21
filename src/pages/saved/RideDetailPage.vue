<template>
  <content-pane>
    <template v-slot:header>
      <v-row
        v-if="ride.state === 'CANCELLED'"
        class="cancelled-banner text-center py-1"
        dense
        no-gutters
      >
        <v-col v-if="isRideInThePast">
          Deze rit was geannuleerd
        </v-col>
        <v-col v-else>
          Deze rit is geannuleerd
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col class="py-0">
        <ride-details :ride="ride" class="mb-4" />
      </v-col>
    </v-row>
    <v-row v-for="(leg, index) in generateSteps" :key="index" class="mx-3 py-0">
      <itinerary-leg :leg="leg" :step="index" />
    </v-row>
    <v-row v-if="numBookings > 0">
      <v-col class="mx-1">
        <v-btn
          large
          rounded
          block
          outlined
          color="primary"
          @click="contactPassenger"
        >
          Stuur bericht naar passagier
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="rideOptions.length > 0" class="mb-0">
      <v-col class="pb-0">
        <h3>Wijzigen</h3>
      </v-col>
    </v-row>
    <v-row v-if="rideOptions.length > 0">
      <v-col>
        <itinerary-options :options="rideOptions" />
      </v-col>
    </v-row>
    <contact-traveller-modal
      v-if="showContactTravellerModal"
      :show="showContactTravellerModal"
      :users="passengersInBookings"
      @close="showContactTravellerModal = false"
      @select="onTravellerSelectForMessage"
    ></contact-traveller-modal>
    <v-dialog v-model="showEditRideModal">
      <edit-ride-dialog
        :ride="ride"
        @save="onUpdateRide"
        @cancel="onCancelDialog"
      />
    </v-dialog>
    <v-dialog v-model="showDeleteRideModal">
      <cancel-ride-dialog
        :ride="ride"
        @delete="onDeleteRide"
        @cancel="onCancelDialog"
      />
    </v-dialog>
  </content-pane>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import ContentPane from '@/components/common/ContentPane.vue'
import ContactTravellerModal from '@/components/itinerary-details/ContactTravellerModal'
import EditRideDialog from '@/components/dialogs/EditRideDialog'
import RideDetails from '@/components/itinerary-details/RideDetails.vue'
import { generateRideItineraryDetailSteps } from '@/utils/itinerary_steps'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as msStore from '@/store/message-service'
import BookingList from '@/components/common/BookingList'
import moment from 'moment'
import * as isStore from '@/store/itinerary-service'
import * as gsStore from '@/store/geocoder-service'
import { geoLocationToPlace } from '@/utils/Utils'
import CancelRideDialog from '@/components/dialogs/CancelRideDialog'

export default {
  name: 'RideDetailPage',
  components: {
    EditRideDialog,
    CancelRideDialog,
    ContactTravellerModal,
    ContentPane,
    // JR Note: A Ride is NOT the same as a Trip itinerary
    // This is a hacky solution
    ItineraryLeg,
    ItineraryOptions,
    RideDetails,
  },
  props: {
    rideId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedLeg: null,
      warningDialog: false,
      cancelReason: '',
      showContactTravellerModal: false,
      showEditRideModal: false,
      showDeleteRideModal: false,
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    confirmedBookings() {
      return !this.ride?.bookings
        ? []
        : this.ride.bookings.filter(
            booking => booking.state.toUpperCase() === 'CONFIRMED'
          )
    },
    activeBookings() {
      return !this.ride?.bookings
        ? []
        : this.ride.bookings.filter(
            booking => booking.state.toUpperCase() !== 'CANCELLED'
          )
    },
    numBookings() {
      return this.activeBookings.length
    },
    passengersInBookings() {
      return this.activeBookings.map(booking => {
        return {
          name: `${booking.passenger.givenName} ${booking.passenger.familyName}`,
          id: booking.passenger.managedIdentity,
          context: this.ride.rideRef,
          contextText: `Meerijden ${this.formatTime(
            booking.departureTime
          )} van ${booking.pickup.label} naar ${booking.dropOff.label}`,
        }
      })
    },
    ride() {
      return csStore.getters.getSelectedRide
    },
    isRideInThePast() {
      return (
        this.ride?.departureTime &&
        moment(this.ride.departureTime).isBefore(moment())
      )
    },
    generateSteps() {
      let steps = []
      if (this.ride?.rideRef) {
        steps = generateRideItineraryDetailSteps(this.ride)
      }
      return steps
    },
    rideOptions() {
      let options = []
      const { state } = this.ride
      switch (state) {
        case 'SCHEDULED':
          // A ride with a proposed or confirmed booking cannot be modified right now
          if (this.activeBookings.length === 0) {
            options.push({
              icon: 'fa-pencil-alt',
              label: 'Wijzig deze rit',
              callback: this.onRideEdit,
            })
          }
          options.push({
            icon: 'fa-times-circle',
            label: 'Annuleer deze rit',
            callback: this.onRideCancel,
          })
          break
        case 'VALIDATING':
          options.push({
            icon: 'fa-check-circle',
            label: 'Bevestig deze rit',
            callback: this.onRideReview,
          })
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onRideReplan,
          })
          break
        case 'COMPLETED':
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onRideReplan,
          })
          break
        case 'CANCELLED':
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onRideReplan,
          })
          break
      }
      return options
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    // Fetch the ride on details page. This is needed for deeplinking.
    csStore.mutations.setSelectedRide({})
    csStore.actions.fetchRide({ id: this.rideId })
  },
  methods: {
    formatTime(t) {
      return t
        ? moment(t)
            .locale('nl')
            .calendar()
        : '- - : - -'
    },
    onLegSelected(leg) {
      this.selectedLeg = leg
    },
    onRideReview() {
      csStore.actions.confirmRide({ id: this.rideId })
    },
    onRideCancel() {
      this.showDeleteRideModal = true
    },
    onDeleteRide(params) {
      const { scope, cancelReason } = params
      this.showDeleteRideModal = false
      csStore.actions
        .deleteRide({
          id: this.rideId,
          cancelReason: cancelReason,
          scope: scope,
        })
        .then(() => this.$router.push('/tripsOverviewPage'))
    },
    contactPassenger() {
      if (this.passengersInBookings.length > 1) {
        this.showContactTravellerModal = true
      } else {
        this.onTravellerSelectForMessage(this.passengersInBookings[0])
      }
    },
    onTravellerSelectForMessage(traveller) {
      this.$router.push({
        name: `conversation`,
        params: {
          context: traveller.context,
          contextText: traveller.contextText,
          participants: [this.profile.id, traveller.id],
        },
      })
    },
    onRideEdit() {
      this.showEditRideModal = true
    },
    onRideReplan() {
      const from = this.ride.fromPlace
      const to = this.ride.toPlace
      isStore.mutations.setSearchCriteria({ from, to })
      gsStore.mutations.setGeoLocationPicked({
        query: from.label,
        field: 'from',
        place: geoLocationToPlace(from),
      })
      gsStore.mutations.setGeoLocationPicked({
        query: to.label,
        field: 'to',
        place: geoLocationToPlace(to),
      })
      this.$router.push('/plan')
    },
    onUpdateRide(update) {
      let newRide = { ...this.ride }
      delete newRide.state
      delete newRide.legs
      const wasRecurring = newRide.recurrence !== undefined
      const travelTime = update.travelTime.when.toISOString()
      newRide.arrivalTimePinned = update.travelTime.arriving
      if (newRide.arrivalTimePinned) {
        newRide.arrivalTime = travelTime
        delete newRide.departureTime
      } else {
        newRide.departureTime = travelTime
        delete newRide.arrivalTime
      }
      if (update.choice === 'sequence') {
        newRide.recurrence = update.recurrence
      }
      let scope = null
      if (wasRecurring) {
        update.choice === 'sequence'
          ? (scope = 'this-and-following')
          : (scope = 'this')
      }
      csStore.actions.updateRide({ ride: newRide, scope: scope }).then(() => {
        this.showEditRideModal = false
        this.$router.go(-1)
      })
    },
    onCancelDialog() {
      this.showEditRideModal = false
      this.showDeleteRideModal = false
    },
  },
}
</script>
<style scoped>
.departure-date {
  text-transform: lowercase;
  padding-left: 0;
}
.departure-date::first-letter {
  text-transform: uppercase;
}
.equal-width {
  width: 100%;
}
.equal-width td {
  width: 14.14%;
  text-align: center;
}
</style>
