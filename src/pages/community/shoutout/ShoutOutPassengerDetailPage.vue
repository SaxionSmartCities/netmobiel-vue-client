<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
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
              @travel-proposal-confirm="onTravelOfferConfirmed"
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

export default {
  name: 'ShoutOutPassengerDetailPage',
  components: {
    ContentPane,
    ItineraryOptions,
    ItinerarySummaryList,
    ShoutOutCancelDialog,
    ShoutOutDetailPassenger,
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
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    shoutOut() {
      return isStore.getters.getSelectedTripPlan
    },
    // The itinerary of the new shout-out
    itinerary() {
      if (this.itineraries.length > 0) {
        return this.itineraries[0]
      }
      return null
    },
    itineraries() {
      // A filtered list of itineraries (removing cancelled offers). Passenger itineraries comprise a single leg.
      if (this.shoutOut?.itineraries) {
        return this.shoutOut.itineraries.filter(
          i => i.legs[0].state !== 'CANCELLED'
        )
      }
      return []
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
      let durationSecs
      if (this.itinerary?.duration) {
        durationSecs = this.itinerary.duration
      } else if (this.shoutOut?.referenceItinerary?.duration) {
        durationSecs = this.shoutOut?.referenceItinerary.duration
      }
      if (durationSecs) {
        result.push({
          label: 'Reisduur',
          value: `${Math.round(durationSecs / 60)} minuten`,
        })
      }
      let distanceMeters
      if (this.shoutOut?.referenceItinerary) {
        distanceMeters = this.shoutOut.referenceItinerary.legs
          .map(leg => leg.distance)
          .reduce((sum, d) => sum + d)
      }
      if (distanceMeters) {
        result.push({
          label: 'Afstand',
          value: `${Math.round(distanceMeters / 1000)} km`,
        })
      }
      return result
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
      const { itineraryRef } = itinerary
      isStore.actions.createTrip({ itineraryRef })
      this.$router.push({ name: 'shoutOuts' })
    },
    onConfirmCancel(args) {
      this.showCancelDialog = false
      isStore.actions
        .cancelTripPlan({
          tripPlanId: this.shoutOutId,
          cancelReason: this.cancelReason,
        })
        .then(() => this.$router.push({ name: 'shoutOuts' }))
    },
    onCloseCancel() {
      this.showCancelDialog = false
    },
  },
}
</script>
<style lang="scss" scoped></style>
