<template>
  <v-row dense>
    <v-col>
      <v-row>
        <v-col>
          <h4 v-if="isProposalCancelled">Jouw (geannuleerde) aanbod:</h4>
          <h4 v-else>Jouw aanbod:</h4>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <itinerary-leg
            v-for="(leg, index) in generateSteps"
            :key="index"
            :leg="leg"
            :showicon="true"
            :showdottedline="false"
            :part-of-passengers-itinerary="true"
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
      <v-row v-if="proposedRide" dense>
        <v-col>
          <v-btn
            large
            rounded
            block
            outlined
            color="primary"
            @click="onShowProposedRide"
          >
            Bekijk gehele rit
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="allProposalsCancelled" dense>
        <v-col>
          <v-btn
            large
            rounded
            block
            depressed
            color="button"
            @click="onMakeOffer"
          >
            Rit aanbieden
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense class="d-flex flex-column">
        <v-col><v-divider /></v-col>
        <v-col class="mt-2">
          <h3>Jouw aanbod</h3>
        </v-col>
        <v-col v-if="!itineraries.length">
          <em>Er zijn geen ritten aangeboden.</em>
        </v-col>
        <v-col v-else>
          <travel-proposal-summary
            v-for="(offer, index) in itineraries"
            :key="index"
            :index="index"
            :itinerary="offer"
            :selected="index === proposalIndex"
            class="my-2"
            @travel-proposal-selected="onTravelProposalSelected"
          />
        </v-col>
      </v-row>
      <v-row class="d-flex flex-column">
        <v-col>
          <h3>Wijzigen</h3>
        </v-col>
        <v-col>
          <itinerary-options :options="options" />
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-model="warningDialog">
      <v-card class="py-1 px-3">
        <v-card-title class="headline"> Verwijder rit met aanbod </v-card-title>
        <v-card-text>
          <v-row class="d-flex flex-column">
            <v-col class="py-0">
              <p class="mb-1">
                Weet je zeker dat je het aanbod wilt intrekken? Geef in een
                persoonlijke boodschap aan waarom je het aanbod intrekt.
              </p>
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
                @click="deleteRide"
              >
                Aanbod Intrekken
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
                @click="cancelDialog"
              >
                Aanbod toch bewaren
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import { generateShoutOutItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as csStore from '@/store/carpool-service'
import TravelProposalSummary from '@/components/community/TravelProposalSummary.vue'

export default {
  name: 'ShoutOutDetailDriver',
  components: {
    ItineraryLeg,
    ItineraryOptions,
    TravelProposalSummary,
  },
  props: {
    shoutOut: { type: Object, required: true },
    proposalIndex: { type: Number, required: true },
  },
  data() {
    return {
      warningDialog: false,
      cancelReason: '',
    }
  },
  computed: {
    itineraries() {
      // List all (my) itineraries, including the cancelled ones.
      return this.shoutOut?.itineraries || []
    },
    proposedRide() {
      if (
        this.proposalIndex >= 0 &&
        this.proposalIndex < this.itineraries.length
      ) {
        return this.itineraries[this.proposalIndex]
      }
      return null
    },
    generateSteps() {
      if (this.shoutOut) {
        return generateShoutOutItineraryDetailSteps(
          this.shoutOut,
          this.proposedRide ?? this.shoutOut.referenceItinerary
        )
      }
      return []
    },
    isProposalCancelled() {
      return (
        this.proposedRide?.legs.find((leg) => leg.state !== 'CANCELLED') == null
      )
    },
    options() {
      let options = []
      if (
        this.proposedRide?.legs.find((leg) => leg.state !== 'CANCELLED') != null
      ) {
        options.push({
          icon: 'fa-times-circle',
          label: 'Aanbod intrekken',
          callback: this.onCancelOffer,
        })
      }
      return options
    },
    // Select the first booking that is not cancelled
    firstValidProposalIndex() {
      return this.itineraries.findIndex(
        (it) => it.legs.find((leg) => leg.state !== 'CANCELLED') != null
      )
    },
    allProposalsCancelled() {
      return true || this.firstValidProposalIndex === -1
    },
  },
  mounted() {
    const ix = this.firstValidProposalIndex
    if (ix >= 0) {
      this.onTravelProposalSelected(ix)
    }
  },
  methods: {
    cancelDialog() {
      this.warningDialog = false
    },
    onCancelOffer() {
      this.warningDialog = true
    },
    deleteRide() {
      this.warningDialog = false
      csStore.actions
        .deleteRide({
          id: this.ride.rideRef,
          reason: this.cancelReason,
          scope: 'this',
        })
        .then(() => this.$router.go(-1))
    },
    onShowMap() {
      this.$emit('show-map-proposal')
    },
    onTravelProposalSelected(index) {
      this.$emit('proposal-selected', index)
    },
    onShowProposedRide() {
      const rideshareLeg = this.proposedRide?.legs.find(
        (lg) => lg.tripId != null
      )
      if (rideshareLeg) {
        this.$emit('show-proposed-ride', rideshareLeg?.tripId)
      }
    },
    onMakeOffer() {
      this.$emit('make-offer')
    },
  },
}
</script>
