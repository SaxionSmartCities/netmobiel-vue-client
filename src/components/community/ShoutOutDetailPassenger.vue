<template>
  <v-row>
    <v-col>
      <v-row v-for="(leg, index) in legs" :key="index" no-gutters>
        <v-col>
          <itinerary-leg
            :leg="leg"
            :showicon="showicon"
            :showdottedline="showdottedline"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn
            large
            rounded
            outlined
            block
            depressed
            color="primary"
            @click="onShowMap"
          >
            Bekijk op de kaart
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="selectedOffer != null">
        <v-col>
          <v-btn
            block
            rounded
            depressed
            color="button"
            :disabled="invalidOffer"
            @click="onConfirm"
          >
            Rit Bevestigen
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense class="d-flex flex-column">
        <v-col><v-divider /></v-col>
        <v-col class="mt-2">
          <h3>Aangeboden ritten</h3>
        </v-col>
        <v-col v-if="!itineraries.length">
          <em>Er zijn nog geen ritten aangeboden.</em>
        </v-col>
        <v-col v-else>
          <travel-proposal-summary
            v-for="(offer, index) in itineraries"
            :key="index"
            :index="index"
            :itinerary="offer"
            :selected="index === selectedOfferIndex"
            class="my-2"
            @travel-proposal-selected="onTravelProposalSelected"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import {
  generateItineraryDetailSteps,
  generateShoutOutDetailSteps,
} from '@/utils/itinerary_steps.js'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import TravelProposalSummary from '@/components/community/TravelProposalSummary.vue'

export default {
  name: 'ShoutOutDetailPassenger',
  components: {
    ItineraryLeg,
    TravelProposalSummary,
  },
  props: {
    shoutOut: { type: Object, required: true },
  },
  data() {
    return {
      selectedOfferIndex: 0,
    }
  },
  computed: {
    itineraries() {
      // List all itineraries, including the cancelled ones.
      return this.shoutOut?.itineraries || []
    },
    selectedOffer() {
      if (
        this.itineraries &&
        this.itineraries.length > this.selectedOfferIndex
      ) {
        return this.itineraries[this.selectedOfferIndex]
      }
      return null
    },
    showicon() {
      return this.selectedOffer != null
    },
    showdottedline() {
      return this.selectedOffer == null
    },
    legs() {
      if (this.selectedOffer == null) {
        return generateShoutOutDetailSteps(this.shoutOut)
      }
      return generateItineraryDetailSteps(this.selectedOffer)
    },
    shoutOutIsClosed() {
      // If requestDuration is set, then the shout-out has been closed.
      return !!this.shoutOut?.requestDuration
    },
    invalidOffer() {
      return (
        this.shoutOutIsClosed ||
        !this.selectedOffer ||
        this.selectedOffer.legs.find((leg) => leg.state === 'CANCELLED')
      )
    },
  },
  methods: {
    onTravelProposalSelected(index) {
      this.selectedOfferIndex = index
      this.$emit('travel-proposal-selected', this.selectedOffer)
    },
    onConfirm() {
      this.$emit('travel-proposal-confirm', this.selectedOffer)
    },
    onClear() {
      this.selectedOffer = null
    },
    onShowMap() {
      this.$emit('show-map')
    },
  },
}
</script>
