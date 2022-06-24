<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <h1>Ritbevestiging herzien?</h1>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <span class="body-2">
          Wil je de rit met
          <strong>{{ passengerName }}</strong> opnieuw beoordelen?
        </span>
      </v-col>
    </v-row>
    <v-row dense class="body-2">
      <v-col v-if="confirmedBooking">
        <v-row dense>
          <v-col cols="6">Reed je passagier mee?</v-col>
          <v-col cols="6">{{
            confirmationText(confirmedBooking.confirmed)
          }}</v-col>
        </v-row>
        <v-row v-if="confirmedBooking.confirmed === false" dense>
          <v-col cols="6">Omdat:</v-col>
          <v-col cols="6">{{
            passengerReasonText(confirmedBooking.confirmationReason)
          }}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6">Volgens de passagier:</v-col>
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
        <v-row dense>
          <v-col cols="6">Ritprijs (credits):</v-col>
          <v-col cols="6">{{ confirmedBooking.fareInCredits }}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6">Status betaling:</v-col>
          <v-col cols="6">{{
            paymentStateText(confirmedBooking.paymentState)
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
    <v-row v-if="confirmedBooking && confirmedBooking.paymentState === 'PAID'">
      <v-col>
        <v-btn
          large
          block
          rounded
          depressed
          color="button"
          :disabled="processing"
          @click="unconfirm"
        >
          Herzien
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      v-else-if="
        confirmedBooking && confirmedBooking.paymentState === 'CANCELLED'
      "
    >
      <v-col>
        <v-alert type="warning" icon="warning" text dense>
          Helaas, de betaling van deze rit is geannuleerd en kan alleen worden
          herzien door je passagier.
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else-if="confirmedBooking">
      <v-col>
        <v-alert type="info" icon="info" text dense
          >Deze rit moet nog bevestigd worden.</v-alert
        >
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
import constants from '@/constants/constants'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'RideUnconfirmPage',
  components: {
    ContentPane,
    ItineraryLeg,
  },
  props: {
    rideId: { type: String, required: true },
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
    passenger() {
      return this.confirmedBooking?.passenger
    },
    passengerName() {
      return (
        [this.passenger?.givenName || '', this.passenger?.familyName || '']
          .join(' ')
          .trim() || 'Onbekende passagier'
      )
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
      return value ? 'Ja' : value === false ? 'Nee' : 'Onbeslist'
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
    paymentStateText(value) {
      return value ? constants.PAYMENT_STATE[value] : '-'
    },
    unconfirm() {
      this.processing = true
      csStore.actions
        .unconfirmBookedRide({ id: this.confirmedBooking.bookingRef })
        .then(() => {
          // Add a delay in order to wait for backend to finish asynchronous process
          return setTimeout(
            () =>
              this.$router.push({
                name: 'rideDetailPage',
                params: { rideId: this.rideId },
              }),
            250
          )
        })
    },
  },
}
</script>
<style lang="scss" scoped></style>
