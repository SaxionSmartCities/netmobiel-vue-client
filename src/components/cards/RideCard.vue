<template>
  <v-card
    outlined
    :class="{ 'is-cancelled': cancelled, 'is-completed': completed }"
    @click="$emit('rideSelected', ride.rideRef)"
  >
    <v-overlay
      :color="overlayColor"
      :value="displayOverlay"
      :absolute="true"
      opacity="0.08"
      z-index="99"
    />
    <v-row no-gutters>
      <v-col>
        <v-card-title class="d-flex justify-space-between pt-2">
          <v-row no-gutters>
            <v-col
              class="d-flex justify-space-between subtitle-1 font-weight-bold"
            >
              <span>Vertrek</span>
              <span
                v-if="confirmedBookingCount > 0 || proposedBookingCount === 0"
                class="booking-count"
                >{{ confirmedBookingCount }}
                <span v-if="singleBooking">boeking</span
                ><span v-else>boekingen</span>
              </span>
              <span v-if="proposedBookingCount > 0" class="booking-count"
                >{{ proposedBookingCount }} voorgestelde
                <span v-if="singleBooking">boeking</span
                ><span v-else>boekingen</span>
              </span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-subtitle>
          <v-row no-gutters class="justify-space-between pb-0">
            <v-col class="capitalize"
              >{{
                relativeTime
                  ? formatDateTime(ride.departureTime)
                  : formatDateTime(ride.departureTime, 'HH:mm')
              }}
            </v-col>
            <v-col v-if="ride.recurrence" class="text-right">
              <v-icon>replay</v-icon>
              {{ formatRecurrence() }}
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-card-text class="pb-2">
          <v-icon>directions_car</v-icon>
          <v-row no-gutters>
            <v-col>
              <div class="pt-1 travel-line" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              {{ ride.toPlace.label }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-card-actions>
        <v-icon>keyboard_arrow_right</v-icon>
      </v-card-actions>
    </v-row>
  </v-card>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    ride: { type: Object, required: true },
    relativeTime: { type: Boolean, default: true },
  },
  computed: {
    displayOverlay() {
      return this.completed || this.cancelled
    },
    // HACK: Should be done using CSS.
    overlayColor() {
      if (this.cancelled) {
        return '#d0021b'
      } else if (this.completed) {
        return '#2e8997'
      }
      return ''
    },
    proposedBookingCount() {
      return this.ride.bookings.filter(
        b => b.state.toUpperCase() === 'PROPOSED'
      ).length
    },
    confirmedBookingCount() {
      return this.ride.bookings.filter(
        b => b.state.toUpperCase() === 'CONFIRMED'
      ).length
    },
    singleBooking() {
      return this.confirmedBookingCount + this.proposedBookingCount === 1
    },
    cancelled() {
      return this.ride.state === 'CANCELLED'
    },
    completed() {
      return this.ride.state === 'COMPLETED'
    },
    needsReview() {
      return this.ride.state === 'VALIDATING'
    },
  },
  methods: {
    formatDateTime(dateTime, format) {
      if (!format)
        return moment(dateTime)
          .locale('nl')
          .calendar()
      else
        return moment(dateTime)
          .local('nl')
          .format(format)
    },
    formatDuration() {
      const seconds = this.ride.estimatedDrivingTime,
        minutes = Math.round(seconds / 60)
      return minutes < 60
        ? `${minutes} minuten`
        : `${Math.floor(minutes / 60)} uur ${minutes % 60} minuten`
    },
    formatRecurrence() {
      const { unit, interval, daysOfWeekMask } = this.ride.recurrence
      if (unit === 'DAY') {
        return 'dagelijks'
      }
      if (daysOfWeekMask === 0x1f && interval === 1) {
        return 'elke werkdag'
      }
      const weekday = moment(this.ride.departureTime)
          .locale('nl')
          .format('dd'),
        weekly = interval === 1 ? 'wekelijks' : `elke ${interval} weken`
      return `${weekly} op ${weekday}`
    },
  },
}
</script>
<style lang="scss" scoped>
.booking-count {
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8em;
}
.is-cancelled {
  border-color: $color-alertRed !important;
}
.is-completed {
  border-color: $color-primary !important;
}
</style>
