<template>
  <v-card outlined @click="$emit('rideSelected', ride.id)">
    <v-row no-gutters>
      <v-col>
        <v-card-title class="d-flex justify-space-between pt-2">
          <v-row no-gutters>
            <v-col
              class="d-flex justify-space-between subtitle-1 font-weight-bold"
            >
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
          <v-row no-gutters class="justify-space-between pb-0">
            <v-col class="capitalize">{{ formatTime() }}</v-col>
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
