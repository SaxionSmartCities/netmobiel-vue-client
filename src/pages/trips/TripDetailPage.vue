<template>
  <content-pane>
    <template #header>
      <v-row
        v-if="trip && trip.state === 'CANCELLED'"
        class="cancelled-banner text-center shrink"
        dense
        no-gutters
      >
        <v-col v-if="isDepartureInThePast"> Deze rit was geannuleerd </v-col>
        <v-col v-else> Deze rit is geannuleerd </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col class="py-0">
        <trip-details
          v-if="trip"
          :trip="trip"
          :show-map="showMap"
          @closeMap="showMap = false"
        />
      </v-col>
    </v-row>
    <v-row v-if="isDisputed" dense>
      <v-col>
        <v-alert type="warning">
          Je chauffeur heeft aangegeven dat je wel hebt meegereden. Klopt dat?
          Vraag eventueel opheldering bij de chauffeur door een berichtje te
          sturen.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          @click="showMap = true"
        >
          Bekijk op de kaart
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="containsRideshareLeg">
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          :disabled="!isChatEnabled"
          @click="contactDriver"
        >
          Stuur bericht naar chauffeur
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
    <v-dialog v-model="warningDialog">
      <v-card>
        <v-card-title class="headline"> Rit Verwijderen </v-card-title>
        <v-card-text>
          <v-row class="d-flex flex-column">
            <v-col v-if="drivers && drivers.length > 0" class="py-1">
              <p>
                Je zou met iemand meerijden, geef in een persoonlijke boodschap
                aan waarom je de rit annuleert.
              </p>
              <v-textarea
                v-model="cancelReason"
                outlined
                :auto-grow="true"
                rows="3"
                label="Reden voor annulering"
                hide-details="true"
              ></v-textarea>
            </v-col>
            <v-col v-else class="py-1">
              Weet je zeker dat je deze rit wilt annuleren?
            </v-col>
          </v-row>
          <v-row class="d-flex flex-column py-2">
            <v-col class="py-1">
              <v-btn
                large
                rounded
                block
                depressed
                color="button"
                @click="deleteTrip"
              >
                Verwijderen
              </v-btn>
            </v-col>
            <v-col class="py-1">
              <v-btn
                large
                rounded
                outlined
                block
                depressed
                color="primary"
                @click="cancelDialog"
              >
                Behouden
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import TripDetails from '@/components/itinerary-details/TripDetails.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import { generateItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import * as gsStore from '@/store/geocoder-service'
import { geoLocationToPlace } from '@/utils/Utils'
import * as UrnHelper from '@/utils/UrnHelper'

export default {
  name: 'TripDetailPage',
  components: {
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
      cancelReason: '',
      showMap: false,
      showContactDriverModal: false,
      warningDialog: false,
    }
  },
  computed: {
    isDepartureInThePast() {
      return (
        this.trip?.itinerary.departureTime &&
        moment(this.trip.itinerary.departureTime).isBefore(moment())
      )
    },
    profile() {
      return psStore.getters.getProfile
    },
    hasRideShareDriver() {
      return this.rideshareDriver !== null
    },
    containsRideshareLeg() {
      return !!this.trip?.itinerary?.legs.find(
        (leg) => leg.traverseMode === 'RIDESHARE'
      )
    },
    isChatEnabled() {
      return this.hasRideShareDriver
    },
    drivers() {
      return this.trip?.itinerary?.legs
        .filter((leg) => leg.traverseMode === 'RIDESHARE')
        .map((leg) => {
          const decodedUrn = UrnHelper.decodeUrn(leg.driverId)
          return {
            name: leg.driverName,
            managedIdentity: decodedUrn.id,
            context: leg.bookingId,
            rideRef: leg.tripId,
          }
        })
    },
    rideshareDriver() {
      // Assume there is only one rideshare driver in the trip.
      return this.drivers?.length > 0 ? this.drivers[0] : null
    },
    trip() {
      let trip = isStore.getters.getSelectedTrip
      if (trip) {
        //FIXME Questionable construction. Now we have trip.legs and trip.itinerary.legs at the same time.
        trip.legs = generateItineraryDetailSteps(trip.itinerary)
      }
      return trip
    },
    legToConfirm() {
      return this.trip?.itinerary?.legs.find(
        (lg) => lg.confirmationRequested || lg.confirmationByProviderRequested
      )
    },
    requiresConfirmation() {
      return !!this.legToConfirm
    },
    isDisputed() {
      return (
        this.legToConfirm?.confirmed === false &&
        this.legToConfirm?.confirmedByProvider === true
      )
    },
    tripOptions() {
      let options = []
      if (!this.trip) {
        return options
      }
      const state = this.trip.state
      switch (state) {
        case 'BOOKING':
          options.push({
            icon: 'fa-times-circle',
            label: 'Annuleer deze rit',
            callback: this.onCancelTrip,
          })
          break
        case 'SCHEDULED':
          // Disable edit: Unclear semantics
          // options.push({
          //   icon: 'fa-pencil-alt',
          //   label: 'Wijzig deze rit',
          //   callback: this.onTripEdit,
          // })
          options.push({
            icon: 'fa-times-circle',
            label: 'Annuleer deze rit',
            callback: this.onCancelTrip,
          })
          break
        case 'VALIDATING':
          options.push({
            icon: 'fa-check-circle',
            label: 'Bevestig deze rit',
            callback: this.onTripReview,
          })
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onTripReplan,
          })
          break
        case 'COMPLETED':
          if (this.requiresConfirmation) {
            options.push({
              icon: 'fa-undo',
              label: 'Herzie mijn bevesting',
              callback: this.onTripUndoReview,
            })
          }
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onTripReplan,
          })
          // options.push({
          //   icon: 'fa-times-circle',
          //   label: 'Verwijder deze rit',
          //   callback: this.onTripCancelled,
          // })
          break
        case 'CANCELLED':
          options.push({
            icon: 'fa-redo',
            label: 'Plan deze rit opnieuw',
            callback: this.onTripReplan,
          })
          break
        // options.push({
        //   icon: 'fa-times-circle',
        //   label: 'Verwijder deze rit',
        //   callback: this.onTripCancelled,
        // })
      }
      return options
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    isStore.actions.fetchTrip({ id: this.tripId })
  },
  methods: {
    formatTime(t) {
      return t ? moment(t).locale('nl').calendar() : '- - : - -'
    },
    contactDriver() {
      this.$router.push({
        name: `conversation`,
        params: {
          chatMeta: {
            // Context of the message is the booking
            context: this.rideshareDriver.context,
            // Context of the passenger (me) is the trip
            senderContext: this.trip.tripRef,
            // Context of the driver is the ride
            recipientContext: this.rideshareDriver.rideRef,
            recipientManagedIdentity: this.rideshareDriver.managedIdentity,
          },
        },
      })
    },
    onTripReplan() {
      const { from, to } = this.trip
      isStore.mutations.setSearchCriteria({ from, to })
      this.$router.push('/search')
    },
    // eslint-disable-next-line no-unused-vars
    onTripReview(trip) {
      this.$router.push({
        name: 'tripConfirmPage',
        params: { tripId: this.tripId },
      })
    },
    // eslint-disable-next-line no-unused-vars
    onTripUndoReview(trip) {
      this.$router.push({
        name: 'tripUnconfirmPage',
        params: { tripId: this.tripId },
      })
    },
    cancelDialog() {
      this.warningDialog = false
    },
    onCancelTrip() {
      this.warningDialog = true
    },
    deleteTrip() {
      this.warningDialog = false
      isStore.actions
        .deleteTrip({
          tripId: this.tripId,
          cancelReason: this.cancelReason,
          displayWarning: true,
        })
        .then(() => this.$router.push('/tripCancelledPage'))
    },
    onTripEdit() {
      const { from, to, itinerary, arrivalTimeIsPinned } = this.trip
      const { searchPreferences } = this.profile
      const travelTime = arrivalTimeIsPinned
        ? moment(itinerary.arrivalTime)
        : moment(itinerary.departureTime)
      const searchCriteria = {
        from,
        to,
        preferences: searchPreferences,
        travelTime: {
          when: travelTime,
          arriving: arrivalTimeIsPinned,
        },
      }
      isStore.mutations.setSearchCriteria(searchCriteria)
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
      isStore.actions.searchTripPlan(searchCriteria)
      this.$router.push({
        name: 'searchResults',
        params: { tripId: String(this.trip.id) },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
