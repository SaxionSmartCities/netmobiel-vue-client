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
              :trip="trip"
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
            <shout-out-cancel-dialog />
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
import { formatDateTimeLong } from '@/utils/datetime.js'
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
    id: { type: String, required: true },
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
    }
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    trip() {
      return isStore.getters.getSelectedTrip
    },
    itinerary() {
      if (this.itineraries.length > 0) {
        return this.itineraries[0]
      }
      return null
    },
    itineraries() {
      return this.planResult?.itineraries || []
    },
    itinerarySummaryItems() {
      let result = []
      const { travelTime } = this.trip
      if (travelTime) {
        result.push({ label: 'Datum', value: formatDateTimeLong(travelTime) })
      }
      if (this.itinerary?.duration) {
        const { duration } = this.itinerary
        const reisduur = `${Math.round(duration / 60)} minuten`
        result.push({ label: 'Reisduur', value: reisduur })
      } else {
        result.push({ label: 'Reisduur', value: 'Onbekend' })
      }
      const hasCoordinates =
        this.trip.from !== undefined && this.trip.to !== undefined
      const kilometers = hasCoordinates
        ? getDistance(this.trip.from, this.trip.to, 1000) / 1000
        : 'Onbekend'
      result.push({ label: 'Afstand', value: `${kilometers} km` })
      return result
    },
  },
  mounted() {
    isStore.mutations.clearPlanningResults()
    isStore.actions.fetchShoutOut({ id: this.id })
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    onTripEdit() {
      const { searchPreferences } = this.profile
      let searchCriteria = {
        from: this.trip.from,
        to: this.trip.to,
        preferences: searchPreferences,
        travelTime: {
          when: this.trip.useAsArrivalTime
            ? moment(this.trip.latestArrivalTime)
            : moment(this.trip.earliestDepartureTime),
          arriving: this.trip.useAsArrivalTime,
        },
      }
      isStore.mutations.setSearchCriteria(searchCriteria)
      isStore.actions.submitPlanningsRequest(searchCriteria)
      this.$router.push({
        name: 'searchResults',
        params: {
          tripId: String(this.id),
        },
      })
    },
    onTripCancelled() {
      isStore.actions.deleteShoutOut({ shoutoutPlanId: this.id })
    },
    onTravelOfferConfirmed(itinerary) {
      const { from, to, nrSeats } = this.trip
      const { itineraryRef } = itinerary
      const trip = { from, to, nrSeats, itineraryRef }
      isStore.actions.storeSelectedTrip(trip)
      this.$router.push({ name: 'shoutouts' })
    },
  },
}
</script>
<style lang="scss" scoped>
.departure-date {
  text-transform: lowercase;
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
.bg-light-green {
  background-color: $background-light-green;
}
</style>
