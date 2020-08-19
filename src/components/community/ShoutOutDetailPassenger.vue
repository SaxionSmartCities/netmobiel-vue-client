<template>
  <v-row>
    <v-col>
      <v-row
        v-for="(leg, index) in generateShoutOutSteps()"
        :key="index"
        class="mx-3"
      >
        <itinerary-leg :leg="leg" />
      </v-row>
      <v-row dense class="d-flex flex-column">
        <v-col><v-divider /></v-col>
        <v-col>
          <h3>Rit aanbod</h3>
        </v-col>
        <v-col
          v-if="!trip.itineraries || trip.itineraries.length == 0"
          class="py-3"
        >
          <em>Er zijn nog geen ritten aangeboden.</em>
        </v-col>
        <v-col v-else class="py-3">
          <v-row
            v-for="(offer, index) in trip.itineraries"
            :key="index"
            class="dense px-2 pt-0 pb-1"
          >
            <travel-proposal-summary
              :index="index + 1"
              :itinerary="offer"
              @travelProposalSelected="onTravelProposalSelected"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import TravelProposalSummary from '@/components/community/TravelProposalSummary.vue'
import { generateShoutOutDetailSteps } from '@/utils/itinerary_steps.js'

export default {
  name: 'ShoutOutDetailPassenger',
  components: {
    ItineraryLeg,
    TravelProposalSummary,
  },
  props: {
    trip: { type: Object, required: true },
  },
  methods: {
    generateShoutOutSteps() {
      return generateShoutOutDetailSteps(this.trip)
    },
    onTravelProposalSelected(itinerary) {
      console.log('onTravelOfferSelected: ', itinerary)
    },
  },
}
</script>
