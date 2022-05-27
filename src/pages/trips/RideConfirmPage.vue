<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Reed je passagier mee?</h1>
      </v-col>
    </v-row>
    <v-row dense class="body-2">
      <v-col v-if="confirmedBooking">
        <v-row dense>
          <v-col cols="6">Je laatste antwoord: </v-col>
          <v-col cols="6">{{
            confirmationText(confirmedBooking.confirmed)
          }}</v-col>
        </v-row>
        <v-row v-if="confirmedBooking.confirmed === false" dense>
          <v-col cols="6">Reden: </v-col>
          <v-col cols="6">{{
            passengerReasonText(confirmedBooking.confirmationReason)
          }}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6">Volgens je passagier: </v-col>
          <v-col cols="6">{{
            confirmationText(confirmedBooking.confirmedByPassenger)
          }}</v-col>
        </v-row>
        <v-row v-if="confirmedBooking.confirmedByPassenger === false" dense>
          <v-col cols="6">Omdat:</v-col>
          <v-col cols="6">{{
            passengerReasonText(confirmedBooking.confirmationReasonByPassenger)
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
                :part-of-passengers-itinerary="false"
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
import { generateRideItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import { triStateLogicText } from '@/utils/Utils'
import constants from '@/constants/constants'

export default {
  name: 'RideConfirmPage',
  components: {
    ContentPane,
    ItineraryLeg,
  },
  props: {
    rideId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      processing: false,
    }
  },
  computed: {
    ride() {
      return csStore.getters.getSelectedRide
    },
    travelDate() {
      const departureTime = this.ride?.departureTime
      if (departureTime) {
        return moment(departureTime).locale('nl').format('dddd DD MMMM')
      }
      return 'Onbekend'
    },
    generateSteps() {
      let steps = []
      if (this.ride?.rideRef) {
        steps = generateRideItineraryDetailSteps(this.ride)
      }
      return steps
    },
    confirmedBooking() {
      return this.ride?.bookings?.find(
        (b) => b.state.toUpperCase() === 'CONFIRMED'
      )
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    csStore.actions.fetchRide({ id: this.rideId })
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
        name: 'rideConfirmedPage',
        params: { rideId: this.rideId },
      })
    },
    reject() {
      this.processing = true
      this.$router.push({
        name: 'rideRejectedPage',
        params: { rideId: this.rideId },
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
