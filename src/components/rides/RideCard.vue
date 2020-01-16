<template>
  <v-container travel-card class="pa-2">
    <v-row align="center">
      <v-col cols="11">
        <v-row align="center" class="body-2">
          <v-col cols="7" class="pt-0 pb-0">
            <div v-if="ride.recurrence">
              <v-icon>replay</v-icon>
              {{ formatRecurrence() }}
            </div>
          </v-col>
          <v-col cols="5" class="text-right pt-0 pb-0">
            {{ ride.bookings.length }} boekingen
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="font-weight-bold pt-0 pb-0">Vertrek</v-col>
          <v-col
            cols="8"
            class="pt-0 pb-0 text-overflow-with-ellipsis departure-time"
          >
            {{ formatTime() }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="font-weight-bold pt-0 pb-0">Reisduur</v-col>
          <v-col cols="8" class="pt-0 pb-0 text-overflow-with-ellipsis">
            {{ formatDuration() }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="font-weight-bold pt-0 pb-0">Van</v-col>
          <v-col cols="10" class="pt-0 pb-0 text-overflow-with-ellipsis">
            {{ ride.fromPlace.label }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" class="font-weight-bold pt-0 pb-0">Naar</v-col>
          <v-col cols="10" class="pt-0 pb-0 text-overflow-with-ellipsis">
            {{ ride.toPlace.label }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="1" class="pa-0" @click="showRideDetails()">
        <v-icon>keyboard_arrow_right</v-icon>
      </v-col>
    </v-row>
  </v-container>
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
        return 'Dagelijks'
      }
      const weekday = moment(this.ride.departureTime)
          .locale('nl')
          .format('dd'),
        weekly = interval === 1 ? 'Wekelijks' : `Elke ${interval} weken`
      return `${weekly} op ${weekday}`
    },
    showRideDetails() {
      const { ride } = this
      this.$router.push({
        name: 'rideDetailPage',
        params: { ride, id: ride.id },
      })
    },
  },
}
</script>
<style scoped>
.departure-time {
  text-transform: lowercase;
}
.departure-time::first-letter {
  text-transform: uppercase;
}
.travel-card {
  border-radius: 10px;
  border: 1px $color-light-grey solid;
}
</style>
