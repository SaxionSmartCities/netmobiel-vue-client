<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
        <v-row v-if="selectedLegs && shouldShowMap" class="pa-0">
          <v-col class="pa-0">
            <route-map
              ref="mapComp"
              :legs="selectedLegs"
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
          <v-col class="py-0">
            <itinerary-summary-list :items="itinerarySummaryItems" />
          </v-col>
          <v-col><v-divider /></v-col>
          <v-col>
            <shout-out-detail-passenger
              v-if="shoutOut && shoutOut.planRef"
              :shout-out="shoutOut"
              @travel-proposal-selected="onTravelOfferSelected"
              @travel-proposal-confirm="onTravelOfferConfirmed"
              @show-map="onMapShow"
            />
          </v-col>
          <v-col class="pt-3 pb-0">
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
import { formatDateTimeLongNoYear } from '@/utils/datetime.js'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import * as gsStore from '@/store/geocoder-service'
import { geoLocationToPlace } from '@/utils/Utils'
import RouteMap from '@/components/itinerary-details/RouteMap'

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
      options: [
        {
          icon: 'fa-pencil-alt',
          label: 'Wijzig deze oproep',
          callback: this.onEditShoutOut,
        },
        {
          icon: 'fa-times-circle',
          label: 'Annuleer deze oproep',
          callback: this.onCancelShoutOut,
        },
      ],
      showCancelDialog: false,
      showMap: false,
      selectedOffer: null,
      mapSize: 'small',
    }
  },
  computed: {
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
          value: formatDateTimeLongNoYear(this.shoutOut?.travelTime),
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
          .map(leg => leg.distance)
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
    selectedLegs() {
      return this.showMap && this.itinerary ? this.itinerary.legs : null
    },
    itinerary() {
      return this.selectedOffer
        ? this.selectedOffer
        : this.shoutOut?.referenceItinerary
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
      this.selectedLegsIndex = null
    },
    onMapShow() {
      this.mapSize = 'small'
      this.showMap = true
    },
  },
}
</script>
<style lang="scss" scoped></style>
