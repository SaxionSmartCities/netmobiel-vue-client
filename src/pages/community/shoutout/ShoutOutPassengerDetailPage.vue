<template>
  <content-pane>
    <template #header>
      <v-row
        v-if="shoutOutIsClosed"
        class="cancelled-banner text-center shrink"
        dense
        no-gutters
      >
        <v-col>
          <span v-if="shoutOut.planState === 'FINAL'"
            >Deze oproep is al ingevuld</span
          >
          <span v-else>Deze oproep is geannuleerd</span>
        </v-col>
      </v-row>
      <v-row
        v-else-if="isShoutOutInThePast"
        class="cancelled-banner text-center shrink"
        dense
        no-gutters
      >
        <v-col> Deze oproep is vervallen </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col>
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
          <v-col>
            <shout-out-detail-passenger
              v-if="shoutOut && shoutOut.planRef"
              :shout-out="shoutOut"
              @travel-proposal-selected="onTravelOfferSelected"
              @travel-proposal-confirm="onTravelOfferConfirmed"
              @show-map="showMap = true"
              @contact-driver="onContactDriver"
            />
          </v-col>
          <v-col>
            <h3>Wijzigen</h3>
          </v-col>
          <v-col>
            <itinerary-options :options="options" />
          </v-col>
        </v-row>
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
import ShoutOutDetailPassenger from '@/components/community/ShoutOutDetailPassenger.vue'
import ShoutOutCancelDialog from '@/components/dialogs/ShoutOutCancelDialog.vue'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import * as gsStore from '@/store/geocoder-service'
import { geoLocationToPlace } from '@/utils/Utils'
import RouteMap from '@/components/itinerary-details/RouteMap'
import { formatDateTimeLongYear } from '@/utils/datetime'
import * as UrnHelper from '@/utils/UrnHelper'

export default {
  name: 'ShoutOutPassengerDetailPage',
  components: {
    ContentPane,
    ItineraryOptions,
    ItinerarySummaryList,
    ShoutOutCancelDialog,
    ShoutOutDetailPassenger,
    RouteMap,
  },
  props: {
    shoutOutId: { type: String, required: true },
  },
  data() {
    return {
      showCancelDialog: false,
      showMap: false,
      selectedOffer: null,
      mapSize: 'small',
    }
  },
  computed: {
    options() {
      let options = []
      if (!this.isShoutOutInThePast) {
        options.push({
          icon: 'fa-pencil-alt',
          label: 'Wijzig deze oproep',
          callback: this.onEditShoutOut,
        })
        options.push({
          icon: 'fa-times-circle',
          label: 'Annuleer deze oproep',
          callback: this.onCancelShoutOut,
        })
      }
      return options
    },
    profile() {
      return psStore.getters.getProfile
    },
    shoutOut() {
      return isStore.getters.getSelectedTripPlan
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
          .map((leg) => leg.distance)
          .reduce((sum, d) => sum + d)
        if (distanceMeters) {
          result.push({
            label: 'Afstand',
            value: `${Math.round(distanceMeters / 1000)} km`,
          })
        }
      }
      return result
    },
    shouldShowMap() {
      return this.showMap
    },
    itinerary() {
      return this.selectedOffer
        ? this.selectedOffer
        : this.shoutOut?.referenceItinerary
    },
    routeMapLegs() {
      return this.showMap && this.itinerary ? this.itinerary.legs : null
    },
    selectedRideshareLeg() {
      return this.itinerary?.legs.find(
        (leg) => leg.traverseMode === 'RIDESHARE'
      )
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
    onEditShoutOut() {
      const { from, to, useAsArrivalTime } = this.shoutOut
      let now = moment()
      let travelTime = useAsArrivalTime
        ? moment(this.shoutOut.latestArrivalTime)
        : moment(this.shoutOut.earliestDepartureTime)
      if (travelTime.isBefore(now)) {
        travelTime = now.add(2, 'hours')
      }
      const { searchPreferences } = this.profile
      const searchCriteria = {
        from: from,
        to: to,
        preferences: searchPreferences,
        travelTime: {
          when: travelTime,
          arriving: useAsArrivalTime,
        },
      }
      if (searchCriteria.travelTime.when.isBefore(now)) {
        searchCriteria.travelTime.when = now.add(2, 'hours')
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
        params: {
          tripId: String(this.shoutOutId),
        },
      })
    },
    onCancelShoutOut() {
      this.showCancelDialog = true
    },
    onTravelOfferConfirmed(itinerary) {
      isStore.actions
        .createTrip(itinerary)
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
  },
}
</script>
<style lang="scss" scoped></style>
