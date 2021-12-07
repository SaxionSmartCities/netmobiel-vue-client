<template>
  <content-pane>
    <template v-slot:header>
      <v-row
        v-if="selectedTrip && selectedTrip.state === 'CANCELLED'"
        class="cancelled-banner text-center py-1"
        dense
        no-gutters
      >
        <v-col v-if="isDepartureInThePast">
          Deze rit was geannuleerd
        </v-col>
        <v-col v-else>
          Deze rit is geannuleerd
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col class="py-0">
        <trip-details
          v-if="selectedTrip"
          :trip="selectedTrip"
          :show-map="showMap"
          @closeMap="onCloseMap"
        />
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
          @click="onShowMap"
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
        <v-card-title class="headline">
          Rit Verwijderen
        </v-card-title>
        <v-card-text>
          <v-row class="d-flex flex-column">
            <v-col v-if="drivers && drivers.length > 0" class="py-1">
              <p>
                U rijdt mee met iemand, geef in een persoonlijke boodschap aan
                waarom u uw rit annuleert.
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
              Weet u zeker dat u deze rit wil annuleren?
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
        this.selectedTrip?.itinerary.departureTime &&
        moment(this.selectedTrip.itinerary.departureTime).isBefore(moment())
      )
    },
    profile() {
      return psStore.getters.getProfile
    },
    hasRideShareDriver() {
      return this.rideshareDriver !== null
    },
    containsRideshareLeg() {
      return !!this.selectedTrip?.itinerary?.legs.find(
        leg => leg.traverseMode === 'RIDESHARE'
      )
    },
    isChatEnabled() {
      return this.hasRideShareDriver
    },
    drivers() {
      return this.selectedTrip?.itinerary?.legs
        .filter(leg => leg.traverseMode === 'RIDESHARE')
        .map(leg => {
          const decodedUrn = UrnHelper.decodeUrn(leg.driverId)
          return {
            name: leg.driverName,
            managedIdentity: decodedUrn.id,
            context: leg.bookingId,
          }
        })
    },
    rideshareDriver() {
      // Assume there is only one rideshare driver in the trip.
      return this.drivers?.length > 0 ? this.drivers[0] : null
    },
    selectedTrip() {
      let trip = isStore.getters.getSelectedTrip
      if (trip) {
        //FIXME Questionable construction. Now we have trip.legs and trip.itinerary.legs at the same time.
        trip.legs = generateItineraryDetailSteps(trip.itinerary)
      }
      return trip
    },
    tripOptions() {
      let options = []
      if (!this.selectedTrip) {
        return options
      }
      const state = this.selectedTrip.state
      const legs = this.selectedTrip.itinerary?.legs
      // I can confirm or deny my leg, in both cases the validating is done
      const validatedMyLeg = legs?.find(l => l.confirmed !== undefined)
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
            callback: this.onCancelTrip,
          })
          break
        case 'VALIDATING':
          if (validatedMyLeg === undefined) {
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
    onShowMap() {
      this.showMap = true
    },
    onCloseMap() {
      this.showMap = false
    },
    contactDriver() {
      this.$router.push({
        name: `conversation`,
        params: {
          chatMeta: {
            senderContext: this.selectedTrip.tripRef,
            recipientContext: this.rideshareDriver.context,
            recipientManagedIdentity: this.rideshareDriver.managedIdentity,
          },
        },
      })
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
          tripId: this.selectedTrip.id,
          cancelReason: this.cancelReason,
          displayWarning: true,
        })
        .then(() => this.$router.push('/tripCancelledPage'))
    },
    onTripEdit() {
      const { from, to, itinerary, arrivalTimeIsPinned } = this.selectedTrip
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
        params: { tripId: String(this.selectedTrip.id) },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
