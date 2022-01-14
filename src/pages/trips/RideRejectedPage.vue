<template>
  <content-pane>
    <v-row class="flex-column">
      <v-col>
        <h1>De passagier is niet meegegaan</h1>
      </v-col>
      <v-col> Wat is de reden? </v-col>
      <v-col>
        <v-radio-group v-model="tripNotMadeReason" class="mt-1" column>
          <v-radio
            v-for="reason in tripNotMadeReasons"
            :key="reason.value"
            :label="reason.title"
            :value="reason.value"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col>
        <v-btn
          class="my-2"
          large
          block
          rounded
          color="button"
          depressed
          :disabled="!tripNotMadeReason"
          @click="tripNotMade()"
        >
          Opslaan
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import constants from '@/constants/constants'
import ContentPane from '@/components/common/ContentPane.vue'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'RideRejectedPage',
  components: {
    ContentPane,
  },
  props: {
    rideId: { type: String, required: true },
  },
  data() {
    return {
      tripNotMadeReasons: constants.DRIVER_TRIP_NOT_MADE_REASONS,
      tripNotMadeReason: null,
    }
  },
  computed: {
    ride() {
      return csStore.getters.getSelectedRide
    },
    confirmedBooking() {
      return this.ride?.bookings?.find(
        (b) => b.state.toUpperCase() === 'CONFIRMED'
      )
    },
    lastReason() {
      let reason
      if (this.ride?.confirmationReason) {
        reason = constants.DRIVER_TRIP_NOT_MADE_REASONS.find(
          (rs) => rs.value === this.ride?.confirmationReason
        )
      }
      return reason
    },
  },
  watch: {
    ride() {
      this.tripNotMadeReason = this.ride.confirmationReason
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    csStore.actions.fetchRide({ id: this.rideId })
  },
  methods: {
    tripNotMade() {
      csStore.actions.rejectBookedRide({
        id: this.confirmedBooking.bookingRef,
        reasonCode: this.tripNotMadeReason,
      })
      this.$router.push({
        name: 'tripReviewedPage',
        params: { otherRole: 'passenger' },
      })
    },
  },
}
</script>

<style scoped></style>
