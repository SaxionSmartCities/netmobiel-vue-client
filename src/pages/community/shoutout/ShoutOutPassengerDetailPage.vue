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
          <v-col>
            <shout-out-cancel-dialog
              :value="cancelDialog"
              @onConfirm="onConfirmCancel"
              @onClose="onCloseCancel"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import { getDistance } from 'geolib'
import { mapGetters } from 'vuex'
import ContentPane from '@/components/common/ContentPane.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import ShoutOutDetailPassenger from '@/components/community/ShoutOutDetailPassenger.vue'
import ShoutOutCancelDialog from '@/components/dialogs/ShoutoutCancelDialog.vue'
import { formatDateTimeLongNoYear } from '@/utils/datetime.js'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'
import * as isStore from '@/store/itinerary-service'
import ShoutOut from '@/components/community/ShoutOut.vue'

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
          callback: this.onTripEdit,
        },
        {
          icon: 'fa-times-circle',
          label: 'Annuleer deze oproep',
          callback: this.onTripCancelled,
        },
      ],
      cancelDialog: {
        isVisible: false,
      },
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
    onTripEdit() {
      const { searchPreferences } = this.profile
      let now = moment()
      let searchCriteria = {
        from: this.shoutOut.from,
        to: this.shoutOut.to,
        preferences: searchPreferences,
        travelTime: {
          when: this.shoutOut.useAsArrivalTime
            ? moment(this.shoutOut.latestArrivalTime)
            : moment(this.shoutOut.earliestDepartureTime),
          arriving: this.shoutOut.useAsArrivalTime,
        },
      }
      if (searchCriteria.travelTime.when.isBefore(now)) {
        searchCriteria.travelTime.when = now.add(2, 'hours')
      }
      isStore.mutations.setSearchCriteria(searchCriteria)
      isStore.actions.searchTripPlan(searchCriteria)
      this.$router.push({
        name: 'searchResults',
        params: {
          tripId: String(this.shoutOutId),
        },
      })
    },
    onTripCancelled() {
      this.cancelDialog.isVisible = true
    },
    onTravelOfferConfirmed(itinerary) {
      const { itineraryRef } = itinerary
      isStore.actions.createTrip({ itineraryRef })
      this.$router.push({ name: 'shoutOuts' })
    },
    onConfirmCancel() {
      this.cancelDialog.isVisible = false
      isStore.actions
        .cancelTripPlan({ tripPlanId: this.shoutOutId })
        .then(() => this.$router.push({ name: 'shoutOuts' }))
    },
    onCloseCancel() {
      this.cancelDialog.isVisible = false
    },
  },
}
</script>
<style lang="scss" scoped></style>
