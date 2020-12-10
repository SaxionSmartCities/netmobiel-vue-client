<template>
  <v-row dense>
    <v-col class="pa-0">
      <v-row>
        <v-col class="pt-0 pb-4">
          <h4>Jouw aanboden rit:</h4>
        </v-col>
      </v-row>
      <v-row
        v-for="(leg, index) in generateSteps()"
        :key="index"
        class="mx-1 py-0"
      >
        <itinerary-leg :leg="leg" :showicon="true" :showdottedline="false" />
      </v-row>
      <v-row class="d-flex flex-column">
        <v-col class="pt-3 pb-0">
          <h3>Wijzigen</h3>
        </v-col>
        <v-col>
          <itinerary-options :options="options" />
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-model="warningDialog">
      <v-card>
        <v-card-title class="headline">
          Weet u dit zeker?
        </v-card-title>
        <v-card-text>
          <p>
            Weet u zeker dat u uw aanbod wilt intrekken?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="deleteRide()">
            Ja
          </v-btn>
          <v-btn text color="primary" @click="warningDialog = false">
            Nee
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import { generateShoutOutDetailSteps } from '@/utils/itinerary_steps.js'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'ShoutOutDetailDriver',
  components: {
    ItineraryLeg,
    ItineraryOptions,
  },
  props: {
    ride: { type: Object, required: true },
  },
  data() {
    return {
      warningDialog: false,
      options: [
        {
          icon: 'fa-times-circle',
          label: 'Aanbod intrekken',
          callback: this.onTripCancelled,
        },
      ],
    }
  },
  methods: {
    generateSteps() {
      const shoutout = { ride: { ...this.ride } }
      return generateShoutOutDetailSteps(shoutout)
    },
    onTripCancelled() {
      this.warningDialog = true
    },
    deleteRide() {
      this.warningDialog = false
      //TODO: This gives an error in the backend.
      // csStore.actions.deleteRide({
      //   id: this.ride.id,
      //   cancelReason: this.cancelReason,
      // })
      // this.$router.go(-1)
    },
  },
}
</script>
