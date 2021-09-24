<template>
  <v-row>
    <v-col>
      <v-row v-if="shoutOut && shoutOut.planRef">
        <v-col class="pt-0">
          <shout-out-travel-proposal-editor
            :time="departureTime"
            :location="departureLocation"
            :is-arrival="false"
            @updateTravelTime="onUpdateTravelTime"
            @locationUpdate="onDepartureLocationUpdate"
            @locationReset="onDepartureLocationReset"
          />
        </v-col>
      </v-row>
      <v-row v-if="generateSteps.length === 0">
        <v-col>
          <em>Helaas, er is geen route gevonden!</em>
        </v-col>
      </v-row>
      <v-row
        v-for="(leg, index) in generateSteps"
        :key="index"
        class="mx-1 py-0"
      >
        <itinerary-leg
          :leg="leg"
          :showicon="false"
          :showdottedline="true"
          :step="index"
        />
      </v-row>
      <v-row v-if="shoutOut && shoutOut.planRef">
        <v-col class="pt-0">
          <shout-out-travel-proposal-editor
            :time="arrivalTime"
            :location="arrivalLocation"
            :is-arrival="true"
            @updateTravelTime="onUpdateTravelTime"
            @locationUpdate="onArrivalLocationUpdate"
            @locationReset="onArrivalLocationReset"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <v-btn
            large
            rounded
            outlined
            block
            mb-4
            depressed
            color="primary"
            @click="onShowMap"
          >
            Bekijk op de kaart
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-3 pb-0">
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            :disabled="generateSteps.length === 0"
            @click="onConfirmTravelOffer"
          >
            Aanbod bevestigen
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            large
            rounded
            block
            depressed
            outlined
            color="primary"
            @click="onCancelProposal"
          >
            Annuleren
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ShoutOutTravelProposalEditor from '@/components/community/ShoutOutTravelProposalEditor'
import {
  generateShoutOutDetailSteps,
  generateItineraryDetailSteps,
} from '@/utils/itinerary_steps.js'
import * as isStore from '@/store/itinerary-service'
import * as gsStore from '@/store/geocoder-service'
import { geoPlaceToCriteria } from '@/utils/Utils'

export default {
  name: 'ShoutOutTravelProposal',
  components: {
    ItineraryLeg,
    ShoutOutTravelProposalEditor,
  },
  props: {
    shoutOut: { type: Object, required: true },
    offer: { type: Object, default: () => {} },
    searchCriteria: { type: Object, default: () => {} },
  },
  data() {
    return {}
  },
  computed: {
    departureLocation() {
      return this.searchCriteria.from
        ? this.searchCriteria.from
        : this.shoutOut.from
    },
    itinerary() {
      return this.offer?.itineraries[0]
        ? this.offer?.itineraries[0]
        : this.shoutOut?.referenceItinerary
    },
    departureTime() {
      let dtime
      if (
        this.searchCriteria.travelTime &&
        !this.searchCriteria.travelTime.arriving
      ) {
        dtime = this.searchCriteria.travelTime.when
      } else if (this.itinerary?.departureTime) {
        dtime = moment(this.itinerary.departureTime)
      }
      return dtime
    },
    arrivalLocation() {
      return this.searchCriteria.to ? this.searchCriteria.to : this.shoutOut.to
    },
    arrivalTime() {
      let atime
      if (
        this.searchCriteria.travelTime &&
        this.searchCriteria.travelTime.arriving
      ) {
        atime = this.searchCriteria.travelTime.when
      } else if (this.itinerary?.arrivalTime) {
        atime = moment(this.itinerary?.arrivalTime)
      }
      return atime
    },
    generateSteps() {
      let steps
      if (this.offer?.planRef) {
        steps = generateItineraryDetailSteps(this.offer.itineraries[0])
        // Add the passenger to the rideshare legs for the GUI
        steps
          .filter(leg => leg.traverseMode === 'RIDESHARE')
          .forEach(leg => (leg.passenger = { ...this.shoutOut.traveller }))
      } else if (this.shoutOut?.planRef) {
        steps = generateShoutOutDetailSteps(this.shoutOut, undefined)
      } else {
        steps = []
      }
      return steps
    },
  },
  methods: {
    onCancelProposal() {
      this.$emit('proposalCancel')
    },
    onDepartureLocationReset() {
      this.$emit('departureLocationReset')
    },
    onDepartureLocationUpdate() {
      this.$emit('departureLocationUpdate')
    },
    onArrivalLocationReset() {
      this.$emit('arrivalLocationReset')
    },
    onArrivalLocationUpdate() {
      this.$emit('arrivalLocationUpdate')
    },
    onUpdateTravelTime(travelTime) {
      // travelTime.when is a moment, travelTime.arriving flags which field.
      this.$emit('updateTravelTime', travelTime)
    },
    onConfirmTravelOffer() {
      this.$emit('confirmTravelOffer')
    },
    onShowMap() {
      this.$emit('show-map-proposal')
    },
  },
}
</script>
