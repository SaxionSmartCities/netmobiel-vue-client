<template>
  <div v-if="showAlert">
    <v-alert v-if="actionRequired" type="warning" icon="warning" text dense>
      <span v-if="isDisputed && !verbose">
        Verschil van mening over de rit.
      </span>
      <span v-else-if="isDisputed && verbose">
        Jij en de chauffeur verschillen van mening over of er wel of niet is
        meegereden. Overleg met elkaar of er een misverstand is en/of corrigeer
        je ritbevestiging.
      </span>
      <span v-else-if="needsReview">
        Bevestig dat de rit heeft plaatsgevonden.
      </span>
    </v-alert>
    <v-alert v-else type="info" icon="info" text dense>
      <span v-if="needsReviewByProvider">
        De chauffeur moet nog bevestigen.
      </span>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'TripValidationAlert',
  props: {
    tripState: { type: String, required: true },
    leg: { type: Object, required: true },
    verbose: { type: Boolean, default: false },
  },
  computed: {
    needsReview() {
      return this.tripState === 'VALIDATING'
    },
    needsReviewByPassenger() {
      return this.tripState === 'VALIDATING' && this.leg.confirmed == null
    },
    needsReviewByProvider() {
      return (
        this.tripState === 'VALIDATING' && this.leg.confirmedByProvider == null
      )
    },
    isDisputed() {
      return (
        this.leg.confirmed === false && this.leg.confirmedByProvider === true
      )
    },
    actionRequired() {
      return this.needsReviewByPassenger || this.isDisputed
    },
    showAlert() {
      return this.actionRequired || this.needsReviewByProvider
    },
  },
}
</script>

<style scoped></style>
