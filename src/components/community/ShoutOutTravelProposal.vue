<template>
  <v-row>
    <v-col>
      <v-row v-if="showEditor">
        <v-col v-if="offer" class="pt-0">
          <shout-out-travel-proposal-editor
            :time="pickedTime"
            :location="offer.from"
            @updateProposal="onUpdateProposal"
            @locationUpdate="onLocationUpdate"
            @locationReset="onLocationReset"
          />
        </v-col>
      </v-row>
      <v-row v-if="generateSteps().length == 0">
        <v-col>
          <em>Helaas, er is geen route gevonden!</em>
        </v-col>
      </v-row>
      <v-row
        v-for="(leg, index) in generateSteps()"
        :key="index"
        class="mx-1 py-0"
      >
        <itinerary-leg
          :leg="leg"
          :showicon="false"
          :showdottedline="true"
          @legEdit="onLegEdit"
        />
      </v-row>
      <v-row v-if="!offer">
        <v-col class="pt-3 pb-0">
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            :disabled="isProposing"
            @click="onStartProposal"
          >
            Rit aanbieden
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <corona-check-modal
          :value="coronaCheck"
          class="mb-2"
          @done="onCoronaCheckDone"
        ></corona-check-modal>
        <v-col class="pt-3 pb-0">
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            :disabled="generateSteps().length == 0"
            @click="onProposeTravelOffer"
          >
            Aanbod bevestigen
            <v-icon dark right>error_outline</v-icon>
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
import CoronaCheckModal from '@/components/common/CoronaCheckModal'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ShoutOutTravelProposalEditor from '@/components/community/ShoutOutTravelProposalEditor'
import {
  generateShoutOutDetailSteps,
  generateItineraryDetailSteps,
} from '@/utils/itinerary_steps.js'
import * as uiStore from '@/store/ui'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'ShoutOutTravelProposal',
  components: {
    CoronaCheckModal,
    ItineraryLeg,
    ShoutOutTravelProposalEditor,
  },
  props: {
    trip: { type: Object, required: true },
    offer: { type: Object, default: () => {} },
    editing: { type: Boolean, default: false },
  },
  data() {
    return {
      editDeparture: false,
      isProposing: false,
      coronaCheck: {
        isVisible: false,
        coronaFreePast: false,
        coronaFreeHousehold: false,
      },
    }
  },
  computed: {
    showEditor() {
      return this.editDeparture || this.editing
    },
    pickedTime() {
      return isStore.getters.getShoutoutPlanTime
    },
  },
  methods: {
    generateSteps() {
      //HACK: this.steps is not a data prop, if it was it would lead to inf loop.
      if (this.offer) {
        this.steps = generateItineraryDetailSteps(this.offer.itineraries[0])
        if (this.steps.length > 2) {
          this.steps[0].isEditable = true
          this.steps[this.steps.length - 2].passenger = {
            ...this.trip.traveller,
          }
        }
      } else {
        this.steps = generateShoutOutDetailSteps(this.trip)
      }
      return this.steps
    },
    onLegEdit({ step }) {
      if (step == 0) {
        this.editDeparture = !this.editDeparture
        isStore.mutations.setShoutoutPlanTime(
          moment(this.steps[step].startTime)
        )
      }
    },
    onStartProposal() {
      this.isProposing = !this.isProposing
      this.$emit('proposeTravelOffer')
    },
    onCancelProposal() {
      this.isProposing = false
      this.editDeparture = false
      this.$emit('proposalCancel')
    },
    onLocationReset() {
      this.$emit('locationReset')
    },
    onLocationUpdate() {
      this.$emit('locationUpdate')
    },
    onUpdateProposal(request) {
      // Request consists of a time (moment) and location.
      this.$emit('updateProposal', request)
    },
    onProposeTravelOffer() {
      this.coronaCheck.isVisible = true
    },
    onCoronaCheckDone(check) {
      if (check.coronaFreePast && check.coronaFreeHousehold) {
        this.$emit('confirmTravelOffer')
      } else {
        uiStore.actions.queueErrorNotification(
          'Een rit plannen met klachten is niet mogelijk.'
        )
      }
    },
  },
}
</script>
