<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Heb je je passagier meegenomen?</h1>
      </v-col>
    </v-row>
    <v-row v-if="lastAnswer !== undefined">
      <v-col>
        <p>
          Huidige antwoord: {{ logicText(lastAnswer) }}
          {{
            lastAnswer === false && lastReasonText ? ' - ' + lastReasonText : ''
          }}
        </p>
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
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          block
          rounded
          depressed
          color="button"
          :disabled="processing"
          @click="confirm"
        >
          Ja
        </v-btn>
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
          Nee
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import { generateRideItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import { triStateLogicText } from '@/utils/Utils'
import constants from '@/constants/constants'

export default {
  name: 'RideConfirmPage',
  components: {
    ContentPane,
    ItineraryLeg,
  },
  props: {
    rideId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      processing: false,
    }
  },
  computed: {
    ride() {
      return csStore.getters.getSelectedRide
    },
    travelDate() {
      const departureTime = this.ride?.departureTime
      if (departureTime) {
        return moment(departureTime).locale('nl').format('dddd DD MMMM')
      }
      return 'Onbekend'
    },
    generateSteps() {
      let steps = []
      if (this.ride?.rideRef) {
        steps = generateRideItineraryDetailSteps(this.ride)
      }
      return steps
    },
    confirmedBooking() {
      return this.ride?.bookings?.find(
        (b) => b.state.toUpperCase() === 'CONFIRMED'
      )
    },
    lastAnswer() {
      return this.ride?.confirmed
    },
    lastReasonText() {
      let text
      if (this.ride?.confirmationReason) {
        text = constants.DRIVER_TRIP_NOT_MADE_REASONS.find(
          (reason) => reason.value === this.ride?.confirmationReason
        )?.title
      }
      return text
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    csStore.actions.fetchRide({ id: this.rideId })
  },
  methods: {
    logicText(value) {
      return triStateLogicText(value)
    },
    confirm() {
      this.processing = true
      this.$router.push({
        name: 'rideConfirmedPage',
        params: { rideId: this.rideId },
      })
    },
    reject() {
      this.processing = true
      this.$router.push({
        name: 'rideRejectedPage',
        params: { rideId: this.rideId },
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
