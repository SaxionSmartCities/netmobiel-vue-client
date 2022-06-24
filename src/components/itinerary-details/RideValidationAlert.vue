<template>
  <div v-if="showAlert">
    <v-alert v-if="actionRequired" type="warning" icon="warning" text dense>
      <span v-if="isDisputed && !verbose">
        Verschil van mening over de rit.
      </span>
      <span v-else-if="isDisputed && verbose">
        Je passagier reed naar eigen zeggen niet mee:
        <em>{{ passengerReasonText }}</em
        >. Klopt dat? Vraag eventueel opheldering bij de passagier door een
        berichtje te sturen en/of corrigeer je eigen bevestiging.
      </span>
      <span v-else-if="needsReview">
        Bevestig dat de rit heeft plaatsgevonden.
      </span>
    </v-alert>
    <v-alert v-else type="info" icon="info" text dense>
      <span v-if="needsReviewByPassenger">
        De passagier moet nog bevestigen.
      </span>
    </v-alert>
  </div>
</template>

<script>
import constants from '@/constants/constants'

export default {
  name: 'RideValidationAlert',
  props: {
    rideState: { type: String, required: true },
    confirmedBooking: { type: Object, required: true },
    verbose: { type: Boolean, default: false },
  },
  computed: {
    needsReview() {
      return this.rideState === 'VALIDATING'
    },
    needsReviewByPassenger() {
      return (
        this.rideState === 'VALIDATING' &&
        this.confirmedBooking.confirmedByPassenger == null
      )
    },
    needsReviewByProvider() {
      return (
        this.rideState === 'VALIDATING' &&
        this.confirmedBooking.confirmed == null
      )
    },
    isDisputed() {
      return (
        this.confirmedBooking.confirmed === true &&
        this.confirmedBooking.confirmedByPassenger === false
      )
    },
    actionRequired() {
      return this.needsReviewByProvider || this.isDisputed
    },
    showAlert() {
      return this.actionRequired || this.needsReviewByPassenger
    },
    passengerReasonText() {
      return constants.PASSENGER_TRIP_NOT_MADE_REASONS.find(
        (r) => r.value === this.confirmedBooking.confirmationReasonByPassenger
      )?.title
    },
  },
}
</script>

<style scoped></style>
