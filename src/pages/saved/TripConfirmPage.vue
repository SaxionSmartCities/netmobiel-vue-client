<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Bevestig je rit</h1>
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
        <v-btn block rounded depressed outlined color="primary" @click="reject">
          Rit heeft niet plaatsgevonden
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-btn block rounded depressed color="button" @click="confirm">
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
import { formatDateTimeLong } from '@/utils/datetime.js'
import * as uiStore from '@/store/ui'
import * as itStore from '@/store/itinerary-service'

export default {
  name: 'TripConfirmPage',
  components: {
    ContentPane,
    ItineraryLeg,
  },
  props: {
    id: { type: String, required: true },
  },
  computed: {
    trip() {
      return itStore.getters.getSelectedTrip
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
      console.log('TODO')
    },
    reject() {
      console.log('TODO')
    },
  },
}
</script>
