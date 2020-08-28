<template>
  <v-card outlined @click="$emit('rideSelected', index)">
    <v-row no-gutters>
      <v-col>
        <v-card-title class="d-flex justify-space-between">
          <v-row no-gutters>
            <v-col class="d-flex justify-space-between subtitle-1">
              <span>Vertrek</span>
              <span class="booking-count">
                {{
                  ride.bookings.filter(booking => booking.state === 'CONFIRMED')
                    .length
                }}
                boekingen
              </span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-subtitle>
          <span>{{ formatTime() }}</span>
          <span v-if="ride.recurrence" class="float-right">
            <v-icon>replay</v-icon>
            {{ formatRecurrence() }}
          </span>
        </v-card-subtitle>
        <v-card-text>
          <v-icon>directions_car</v-icon>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="pt-1 travel-line" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
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
    index: { type: Number, required: true },
    ride: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatTime() {
      return moment(this.ride.departureTime)
        .locale('nl')
        .calendar()
    },
    formatDuration() {
      const seconds = this.ride.estimatedDrivingTime,
        minutes = Math.round(seconds / 60)
      return minutes < 60
        ? `${minutes} minuten`
        : `${Math.floor(minutes / 60)} uur ${minutes % 60} minuten`
    },
    formatRecurrence() {
      const { unit, interval } = this.ride.recurrence
      if (unit === 'DAY') {
        return 'dagelijks'
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
<style scoped>
.booking-count {
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.8em;
}
</style>
