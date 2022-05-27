<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Heb je meegereden?</h1>
      </v-col>
    </v-row>
    <v-row dense class="body-2">
      <v-col v-if="bookedLeg">
        <v-row dense>
          <v-col cols="6">Je laatste antwoord: </v-col>
          <v-col cols="6">{{ confirmationText(bookedLeg.confirmed) }}</v-col>
        </v-row>
        <v-row v-if="bookedLeg.confirmed === false" dense>
          <v-col cols="6">Reden: </v-col>
          <v-col cols="6">{{
            passengerReasonText(bookedLeg.confirmationReason)
          }}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6">Volgens je chauffeur: </v-col>
          <v-col cols="6">{{
            confirmationText(bookedLeg.confirmedByProvider)
          }}</v-col>
        </v-row>
        <v-row v-if="bookedLeg.confirmedByProvider === false" dense>
          <v-col cols="6">Omdat:</v-col>
          <v-col cols="6">{{
            passengerReasonText(bookedLeg.confirmationReasonByProvider)
          }}</v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="px-1">
          <v-row class="d-flex flex-column">
            <v-col>
              <h4 class="netmobiel">{{ travelDate }}</h4>
            </v-col>
            <v-col>
              <itinerary-leg
                v-for="(leg, index) in generateSteps"
                :key="index"
                :step="index"
                :leg="leg"
                :part-of-passengers-itinerary="true"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          block
          rounded
          depressed
          color="button"
          :disabled="processing"
          @click="confirm"
        >
          Ja
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          depressed
          color="primary"
          :disabled="processing"
          @click="reject"
        >
          Nee
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import { generateItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as uiStore from '@/store/ui'
import * as isStore from '@/store/itinerary-service'
import { triStateLogicText } from '@/utils/Utils'
import constants from '@/constants/constants'

export default {
  name: 'TripConfirmPage',
  components: {
    ContentPane,
    ItineraryLeg,
  },
  props: {
    tripId: { type: String, required: true },
  },
  data() {
    return {
      processing: false,
    }
  },
  computed: {
    trip() {
      return isStore.getters.getSelectedTrip
    },
    travelDate() {
      const departureTime = this.trip?.itinerary?.departureTime
      if (departureTime) {
        return moment(departureTime).locale('nl').format('dddd DD MMMM')
      }
      return 'Onbekend'
    },
    generateSteps() {
      let steps = []
      if (this.trip?.tripRef) {
        steps = generateItineraryDetailSteps(this.trip?.itinerary)
      }
      return steps
    },
    bookedLeg() {
      return this.trip?.itinerary?.legs.find((lg) => lg.bookingId)
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    isStore.actions.fetchTrip({ id: this.tripId })
  },
  methods: {
    confirmationText(value) {
      return triStateLogicText(value)
    },
    passengerReasonText(reasonCode) {
      return constants.PASSENGER_TRIP_NOT_MADE_REASONS.find(
        (r) => r.value === reasonCode
      )?.title
    },
    providerReasonText(reasonCode) {
      return constants.DRIVER_TRIP_NOT_MADE_REASONS.find(
        (r) => r.value === reasonCode
      )?.title
    },
    confirm() {
      this.processing = true
      this.$router.push({
        name: 'tripConfirmedPage',
        params: { tripId: this.tripId },
      })
    },
    reject() {
      this.processing = true
      this.$router.push({
        name: 'tripRejectedPage',
        params: { tripId: this.tripId },
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
