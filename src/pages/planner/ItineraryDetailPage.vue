<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
        <trip-details
          :trip="selectedTrip"
          :show-map="showMap"
          @closeMap="showMap = false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <v-btn
          v-show="showSection"
          large
          rounded
          block
          mb-4
          depressed
          color="button"
          @click="onPlanTrip"
        >
          Deze rit bevestigen
          <v-icon dark right>error_outline</v-icon>
        </v-btn>
      </v-col>
      <v-col>
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
          bekijk op de kaart
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TripDetails from '@/components/itinerary-details/TripDetails.vue'
import * as uiStore from '@/store/ui'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'ItineraryDetailPage',
  components: {
    ContentPane,
    TripDetails,
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
      showConfirmationButton: true,
    }
  },
  computed: {
    selectedTrip() {
      return isStore.getters.getSelectedTrip
    },
    showSection() {
      return this.showConfirmationButton
    },
    bookingStatus() {
      return isStore.getters.getBookingStatus
    },
  },
  watch: {
    bookingStatus(newValue) {
      if (newValue.status === 'SUCCESS') {
        isStore.mutations.clearBookingRequest()
        this.$router.push('/tripPlanSubmitted')
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    if (this.selectedTrip.state === 'SCHEDULED') {
      this.showConfirmationButton = false
    }
  },
  methods: {
    onPlanTrip() {
      const { itineraryRef } = this.selectedTrip
      isStore.actions.createTrip({ itineraryRef })
      if (this.tripId !== '-1') {
        // We are editing a trip so remove the old one.
        isStore.actions.deleteTrip({
          tripId: this.tripId,
          displayWarning: false,
        })
      }
    },
    showFullRouteOnMap() {
      this.showMap = true
    },
  },
}
</script>

<style lang="scss"></style>
