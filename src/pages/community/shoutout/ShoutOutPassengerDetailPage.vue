<template>
  <content-pane>
    <template #header>
      <shout-out-banner v-if="shoutOut" :shout-out="shoutOut" />
    </template>
    <v-row v-if="routeMapLegs && routeMapLegs.length > 0 && shouldShowMap">
      <v-col>
        <route-map
          ref="mapComp"
          :legs="routeMapLegs"
          :map-size-prop="mapSize"
          :single-leg-dashed="false"
          @sizeChanged="onMapSizeChanged"
          @closeMap="onMapClose"
        >
        </route-map>
      </v-col>
    </v-row>
    <v-row dense class="d-flex flex-column">
      <v-col>
        <h1>Oproep details</h1>
      </v-col>
      <v-col><v-divider /></v-col>
      <v-col>
        <itinerary-summary-list :items="itinerarySummaryItems" />
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <v-row v-if="shoutOut && shoutOut.planRef">
      <v-col>
        <v-row v-for="(leg, index) in generateSteps" :key="index" no-gutters>
          <v-col>
            <itinerary-leg
              :leg="leg"
              :showicon="showicon"
              :showdottedline="showdottedline"
              :part-of-passengers-itinerary="true"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-btn
              large
              rounded
              outlined
              block
              depressed
              color="primary"
              @click="showMap = true"
            >
              Bekijk op de kaart
            </v-btn>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-btn
              large
              rounded
              block
              outlined
              color="primary"
              :disabled="!isChatEnabled"
              @click="onContactDriver"
            >
              Stuur bericht naar chauffeur
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="isAcceptedOffer" dense>
          <v-col>
            <v-btn large rounded block color="button" @click="onShowTrip">
              Bekijk mijn rit
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else-if="selectedOffer != null" dense>
          <v-col>
            <v-btn
              block
              rounded
              depressed
              color="button"
              :disabled="invalidOffer"
              @click="onTravelOfferConfirmed"
            >
              Bevestig aanbod
            </v-btn>
          </v-col>
        </v-row>
        <v-row dense class="d-flex flex-column">
          <v-col><v-divider /></v-col>
          <v-col class="mt-2">
            <h3>Aangeboden ritten</h3>
          </v-col>
          <v-col v-if="!itineraries.length">
            <em>Er zijn geen ritten aangeboden.</em>
          </v-col>
          <v-col v-else>
            <travel-proposal-summary
              v-for="(offer, index) in itineraries"
              :key="index"
              :index="index"
              :itinerary="offer"
              :selected="index === selectedOfferIndex"
              class="my-2"
              @travel-proposal-selected="selectedOfferIndex = index"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="d-flex flex-column">
      <v-col>
        <h3>Wijzigen</h3>
      </v-col>
      <v-col>
        <itinerary-options :options="options" />
      </v-col>
    </v-row>
    <v-dialog v-model="showCancelDialog">
      <shout-out-cancel-dialog
        :shout-out="shoutOut"
        @onConfirm="onConfirmCancel"
        @onClose="onCloseCancel"
      />
    </v-dialog>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import ShoutOutCancelDialog from '@/components/dialogs/ShoutOutCancelDialog.vue'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import RouteMap from '@/components/itinerary-details/RouteMap'
import { formatDateTimeLongYear } from '@/utils/datetime'
import * as UrnHelper from '@/utils/UrnHelper'
import ShoutOutBanner from '@/components/community/ShoutOutBanner'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg'
import TravelProposalSummary from '@/components/community/TravelProposalSummary'
import { generateShoutOutItineraryDetailSteps } from '@/utils/itinerary_steps'
import {
  restoreDataBeforeRouteEnter,
  saveDataBeforeRouteLeave,
} from '@/utils/navigation'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'ShoutOutPassengerDetailPage',
  components: {
    ContentPane,
    ItineraryOptions,
    ItinerarySummaryList,
    ShoutOutCancelDialog,
    ItineraryLeg,
    TravelProposalSummary,
    RouteMap,
    ShoutOutBanner,
  },
  beforeRouteEnter(to, from, next) {
    // The restore is called after the mount!
    // console.log(`beforeRouteEnter: ${from.name} --> ${to.name}`)
    next((vm) =>
      restoreDataBeforeRouteEnter(vm, {
        selectedOfferIndex: (value) => value,
      })
    )
  },
  beforeRouteLeave(to, from, next) {
    // console.log(`beforeRouteLeave: ${from.name} --> ${to.name}`)
    saveDataBeforeRouteLeave(this, {
      selectedOfferIndex: (value) => value,
    })
    next()
  },
  props: {
    shoutOutId: { type: String, required: true },
  },
  data() {
    return {
      showCancelDialog: false,
      showMap: false,
      mapSize: 'small',
      selectedOfferIndex: -1,
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    shoutOut() {
      return isStore.getters.getSelectedTripPlan
    },
    itineraries() {
      // List all itineraries, including the cancelled ones.
      return this.shoutOut?.itineraries || []
    },
    selectedOffer() {
      if (
        this.selectedOfferIndex >= 0 &&
        this.selectedOfferIndex < this.itineraries.length
      ) {
        return this.itineraries[this.selectedOfferIndex]
      }
      return null
    },
    shouldShowMap() {
      return this.showMap
    },
    routeMapLegs() {
      return this.showMap && this.itinerary ? this.itinerary.legs : null
    },
    itinerary() {
      return this.selectedOffer
        ? this.selectedOffer
        : this.shoutOut?.referenceItinerary
    },
    showicon() {
      return this.selectedOffer != null
    },
    showdottedline() {
      return this.selectedOffer == null
    },
    generateSteps() {
      if (this.shoutOut) {
        return generateShoutOutItineraryDetailSteps(
          this.shoutOut,
          this.selectedOffer
        )
      }
      return []
    },
    shoutOutIsClosed() {
      // If requestDuration is set, then the shout-out has been closed.
      return !!this.shoutOut?.requestDuration
    },
    isShoutOutInThePast() {
      return (
        this.shoutOut?.latestArrivalTime &&
        moment(this.shoutOut?.latestArrivalTime).isBefore(moment())
      )
    },
    invalidOffer() {
      return (
        this.shoutOutIsClosed ||
        this.isShoutOutInThePast ||
        this.selectedOffer == null ||
        this.isCancelledOffer
      )
    },
    isFinal() {
      return this.shoutOut?.planState === 'FINAL'
    },
    isCancelledOffer() {
      return (
        this.selectedOffer?.legs.find((leg) => leg.state === 'CANCELLED') !=
        null
      )
    },
    isAcceptedOffer() {
      return (
        this.isFinal && this.selectedOffer != null && !this.isCancelledOffer
      )
    },
    isChatEnabled() {
      return this.selectedOffer != null
    },
    selectedRideshareLeg() {
      return this.selectedOffer?.legs.find(
        (leg) => leg.traverseMode === 'RIDESHARE'
      )
    },
    options() {
      let options = []
      if (!this.isShoutOutInThePast && !this.shoutOutIsClosed) {
        // No edit, semantics are unclear
        // options.push({
        //   icon: 'fa-pencil-alt',
        //   label: 'Wijzig deze oproep',
        //   callback: this.onEditShoutOut,
        // })
        options.push({
          icon: 'fa-times-circle',
          label: 'Annuleer deze oproep',
          callback: this.onCancelShoutOut,
        })
      }
      return options
    },
    itinerarySummaryItems() {
      let result = []
      const travelTime = this.shoutOut?.travelTime
      if (travelTime) {
        result.push({
          label: 'Datum',
          value: formatDateTimeLongYear(this.shoutOut?.travelTime),
        })
      }
      if (this.itinerary?.duration) {
        result.push({
          label: 'Reisduur',
          value: `${Math.round(this.itinerary.duration / 60)} minuten`,
        })
      }
      if (this.itinerary?.legs) {
        const distanceMeters = this.itinerary.legs
          .filter((leg) => leg.distance != null)
          .map((leg) => leg.distance)
          .reduce((sum, d) => sum + d)
        if (distanceMeters) {
          result.push({
            label: 'Afstand',
            value: `${Math.round(distanceMeters / 1000)} km`,
          })
        }
      }
      const fare = this.shoutOut?.referenceItinerary?.legs
        .filter((leg) => leg.fareInCredits != null)
        .map((leg) => leg.fareInCredits)
        .reduce((sum, f) => sum + f)
      if (fare) {
        result.push({
          label: 'Kosten',
          value: `${fare} credits`,
        })
      }
      return result
    },
  },
  watch: {
    shoutOut() {
      // Select the first booking that is not cancelled
      if (this.itineraries?.length > 0) {
        if (this.selectedOfferIndex < 0) {
          this.selectedOfferIndex = this.itineraries.findIndex(
            (it) => it.legs.find((leg) => leg.state !== 'CANCELLED') != null
          )
          // If all cancelled, then select the first one
          if (this.selectedOfferIndex < 0) {
            this.selectedOfferIndex = 0
          }
        }
      }
    },
  },
  mounted() {
    isStore.mutations.clearPlanningResults()
    // For a traveller a shout-out is just another trip plan.
    isStore.actions.fetchTripPlan({ id: this.shoutOutId })
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    // onEditShoutOut() {
    //   const { from, to, useAsArrivalTime } = this.shoutOut
    //   let now = moment()
    //   let travelTime = useAsArrivalTime
    //     ? moment(this.shoutOut.latestArrivalTime)
    //     : moment(this.shoutOut.earliestDepartureTime)
    //   if (travelTime.isBefore(now)) {
    //     travelTime = now.add(2, 'hours')
    //   }
    //   const { searchPreferences } = this.profile
    //   const searchCriteria = {
    //     from: from,
    //     to: to,
    //     preferences: searchPreferences,
    //     travelTime: {
    //       when: travelTime,
    //       arriving: useAsArrivalTime,
    //     },
    //   }
    //   if (searchCriteria.travelTime.when.isBefore(now)) {
    //     searchCriteria.travelTime.when = now.add(2, 'hours')
    //   }
    //   isStore.mutations.setSearchCriteria(searchCriteria)
    //   gsStore.mutations.setGeoLocationPicked({
    //     query: from.label,
    //     field: 'from',
    //     place: geoLocationToPlace(from),
    //   })
    //   gsStore.mutations.setGeoLocationPicked({
    //     query: to.label,
    //     field: 'to',
    //     place: geoLocationToPlace(to),
    //   })
    //   isStore.actions.searchTripPlan(searchCriteria)
    //   this.$router.push({
    //     name: 'searchResults',
    //     params: {
    //       tripId: String(this.shoutOutId),
    //     },
    //   })
    // },
    onCancelShoutOut() {
      this.showCancelDialog = true
    },
    onTravelOfferConfirmed() {
      isStore.actions
        .createTrip(this.selectedOffer)
        .then(() => this.$router.push({ name: 'shoutOuts' }))
        .catch(() => {})
    },
    onTravelOfferSelected(itinerary) {
      this.selectedOffer = itinerary
    },
    onConfirmCancel(args) {
      this.showCancelDialog = false
      isStore.actions
        .cancelTripPlan({
          tripPlanId: this.shoutOutId,
          cancelReason: args.cancelReason,
        })
        .then(() => this.$router.push({ name: 'shoutOuts' }))
    },
    onCloseCancel() {
      this.showCancelDialog = false
    },
    onMapSizeChanged({ size }) {
      this.mapSize = size
    },
    onMapClose() {
      this.showMap = false
      this.mapSize = 'small'
    },
    onContactDriver() {
      const rsleg = this.selectedRideshareLeg
      if (rsleg) {
        const recipientUrn = UrnHelper.decodeUrn(rsleg.driverId)
        const chatMeta = {
          // The message is about the proposed booking
          context: rsleg.bookingId,
          // Context of passenger (me) is the shout-out
          senderContext: this.shoutOut.planRef,
          // Context of the driver is the proposed ride
          recipientContext: rsleg.tripId,
          // The driver is the recipient, the drive rid is a keycloak urn in the leg
          recipientManagedIdentity: recipientUrn.id,
        }
        this.$router.push({
          name: `conversation`,
          params: {
            chatMeta,
          },
        })
      }
    },
    onShowTrip() {
      // Lookup the booking of the selected offer
      if (this.selectedRideshareLeg?.bookingId) {
        // We use the rideshar endpoint to retrieve the booking, because the planner
        // does not have its own booking system (so sorry about this omission).
        csStore.actions
          .fetchBooking(this.selectedRideshareLeg?.bookingId)
          .then((booking) => {
            // Check for the trip reference
            if (booking?.passengerTripRef) {
              this.$router.push({
                name: `tripDetailPage`,
                params: {
                  tripId: booking?.passengerTripRef,
                },
              })
            }
          })
      }
    },
  },
}
</script>
<style lang="scss" scoped></style>
