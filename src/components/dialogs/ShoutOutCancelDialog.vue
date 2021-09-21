<template>
  <v-card class="py-1 px-3">
    <v-card-title class="headline">Verwijder Oproep</v-card-title>
    <v-card-text>
      <v-row class="d-flex flex-column">
        <v-col v-if="numberOfOffers === 0" class="py-1">
          Weet u zeker dat u deze oproep wilt annuleren? Dit kan niet ongedaan
          gemaakt worden.
        </v-col>
        <v-col v-else class="py-1">
          U hebt op dit moment
          {{
            numberOfOffers === 1
              ? 'een aanbod'
              : numberOfOffers + ' aanbiedingen'
          }}
          op uw oproep. Geef in een persoonlijk bericht aan waarom u uw oproep
          verwijdert. Het verwijderen kan niet ongedaan worden gemaakt.
        </v-col>
        <v-col class="py-0">
          <v-textarea
            outlined
            :auto-grow="true"
            rows="3"
            label="Reden voor intrekking"
            hide-details="true"
            :value="cancelReason"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-column py-2">
        <v-col class="py-1">
          <v-btn
            large
            rounded
            block
            depressed
            color="button"
            @click="confirmCancellation"
          >
            Verwijderen
          </v-btn>
        </v-col>
        <v-col class="py-1">
          <v-btn
            large
            rounded
            outlined
            block
            depressed
            color="primary"
            @click="closeCancelDialog"
          >
            Behouden
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ShoutOutCancelDialog',
  components: {},
  props: {
    shoutOut: { type: Object, required: true },
  },
  data() {
    return {
      cancelReason: '',
    }
  },
  computed: {
    hasOffers() {
      return this.numberOfOffers > 0
    },
    itineraries() {
      // A filtered list of itineraries (removing cancelled offers). Passenger itineraries comprise of a single leg.
      if (this.shoutOut?.itineraries) {
        return this.shoutOut.itineraries.filter(
          i => i.legs[0].state !== 'CANCELLED'
        )
      }
      return []
    },
    numberOfOffers() {
      return this.itineraries.length
    },
  },
  methods: {
    confirmCancellation() {
      this.$emit('onConfirm', { cancelReason: this.cancelReason })
    },
    closeCancelDialog() {
      this.$emit('onClose')
    },
  },
}
</script>
