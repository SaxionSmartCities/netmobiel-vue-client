<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Rit geslaagd?</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="px-4 py-2">
          <v-row class="flex-column">
            <v-col class="pb-5">
              <h5>Datum: {{ travelDate }}</h5>
            </v-col>
            <v-col
              v-for="(leg, index) in generateSteps"
              :key="index"
              class="py-0"
            >
              <itinerary-leg :step="index" :leg="leg" />
            </v-col>
          </v-row>
        </v-card>
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
          Rit heeft niet plaatsgevonden
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-btn
          large
          block
          rounded
          depressed
          color="button"
          :disabled="processing"
          @click="confirm"
        >
          Bevestigen
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

export default {
  name: 'TripConfirmPage',
  components: {
    ContentPane,
    ItineraryLeg,
  },
  props: {
    id: { type: String, required: true },
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
      const { departureTime } = this.trip?.itinerary
      if (departureTime) {
        return moment(departureTime)
          .locale('nl')
          .format('dddd DD MMMM')
      }
      return 'Onbekend'
    },
    generateSteps() {
      return generateItineraryDetailSteps(this.trip.itinerary)
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    confirm() {
      this.processing = true
      isStore.actions
        .confirmTrip({ id: this.id })
        .then(() => this.$router.push({ name: 'tripConfirmedPage' }))
    },
    reject() {
      this.processing = true
      this.$router.push({
        name: 'tripNotMade',
        params: { id: this.id },
      })
    },
  },
}
</script>
