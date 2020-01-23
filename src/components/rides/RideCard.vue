<template>
  <v-card outlined @click="showRideDetails()">
    <v-row no-gutters>
      <v-col>
        <v-card-title justify-center>
          <span>Vertrek</span>
          <v-spacer />
          <span class="booking-count">
            {{ ride.bookings.length }} boekingen
          </span>
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
  <!--
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
  -->
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
.booking-count {
  color: rgba(0, 0, 0, 0.54);
  font-size: 75%;
}
</style>
