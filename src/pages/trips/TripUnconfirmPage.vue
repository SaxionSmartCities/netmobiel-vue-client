<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <h1>Ritbevestiging herzien?</h1>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <span class="body-2">
          Wil je de rit met
          <strong>{{ driverName }}</strong> opnieuw beoordelen?
        </span>
      </v-col>
    </v-row>
    <v-row dense class="body-2">
      <v-col v-if="legToConfirm">
        <v-row dense>
          <v-col cols="6">Heb je meegereden?</v-col>
          <v-col cols="6">{{ confirmationText(legToConfirm.confirmed) }}</v-col>
        </v-row>
        <v-row v-if="legToConfirm.confirmed === false" dense>
          <v-col cols="6">Omdat:</v-col>
          <v-col cols="6">{{
            passengerReasonText(legToConfirm.confirmationReason)
          }}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6">Volgens de chauffeur:</v-col>
          <v-col cols="6">{{
            confirmationText(legToConfirm.confirmedByProvider)
          }}</v-col>
        </v-row>
        <v-row v-if="legToConfirm.confirmedByProvider === false" dense>
          <v-col cols="6">Omdat:</v-col>
          <v-col cols="6">{{
            providerReasonText(legToConfirm.confirmationReasonByProvider)
          }}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6">Ritprijs (credits):</v-col>
          <v-col cols="6">{{ legToConfirm.fareInCredits }}</v-col>
        </v-row>
        <v-row dense>
          <v-col cols="6">Status betaling:</v-col>
          <v-col cols="6">{{
            paymentStateText(legToConfirm.paymentState)
          }}</v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="px-1">
          <v-row class="d-flex flex-column">
            <v-col>
              <h4 class="netmobiel">{{ travelDate }}</h4>
            </v-col>
            <v-col>
              <itinerary-leg
                v-for="(leg, index) in generateSteps"
                :key="index"
                :step="index"
                :leg="leg"
                :part-of-passengers-itinerary="true"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="legToConfirm && legToConfirm.paymentState === 'CANCELLED'">
      <v-col>
        <v-btn
          large
          block
          rounded
          depressed
          color="button"
          :disabled="processing"
          @click="unconfirm"
        >
          Herzien
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else-if="legToConfirm && legToConfirm.paymentState === 'PAID'">
      <v-col>
        <v-alert type="warning" icon="warning" text dense>
          Helaas, de betaling van deze rit is al doorgevoerd en kan alleen
          worden herzien door je chauffeur.
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-else-if="legToConfirm">
      <v-col>
        <v-alert type="info" icon="info" text dense
          >Deze rit moet nog bevestigd worden.</v-alert
        >
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
import constants from '@/constants/constants'
import { triStateLogicText } from '@/utils/Utils'

export default {
  name: 'TripUnconfirmPage',
  components: {
    ContentPane,
    ItineraryLeg,
  },
  props: {
    tripId: { type: String, required: true },
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
      const departureTime = this.trip?.itinerary?.departureTime
      if (departureTime) {
        return moment(departureTime).locale('nl').format('dddd DD MMMM')
      }
      return 'Onbekend'
    },
    generateSteps() {
      return generateItineraryDetailSteps(this.trip?.itinerary)
    },
    legToConfirm() {
      return this.trip?.itinerary?.legs.find((lg) => lg.confirmationRequested)
    },
    driverName() {
      return this.legToConfirm?.driverName
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    isStore.actions.fetchTrip({ id: this.tripId })
  },
  methods: {
    confirmationText(value) {
      return triStateLogicText(value)
    },
    passengerReasonText(reasonCode) {
      return constants.PASSENGER_TRIP_NOT_MADE_REASONS.find(
        (r) => r.value === reasonCode
      )?.title
    },
    providerReasonText(reasonCode) {
      return constants.DRIVER_TRIP_NOT_MADE_REASONS.find(
        (r) => r.value === reasonCode
      )?.title
    },
    paymentStateText(value) {
      return value ? constants.PAYMENT_STATE[value] : '-'
    },
    unconfirm() {
      this.processing = true
      isStore.actions.unconfirmTrip({ id: this.tripId }).then(() => {
        // Add a delay in order to wait for backend to finish asynchronous process
        return setTimeout(
          () =>
            this.$router.push({
              name: 'tripDetailPage',
              params: { tripId: this.tripId },
            }),
          250
        )
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
