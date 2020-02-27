<template>
  <v-container>
    <h3 class="ma-2">Rit details</h3>
    <v-divider />
    <v-row>
      <v-col cols="4" class="pt-0 pb-0">Datum</v-col>
      <v-col cols="8" class="departure-date pt-0 pb-0">
        {{ formatDate() }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="pt-0 pb-0">Reisduur</v-col>
      <v-col cols="8" class="pt-0 pb-0">
        {{ formatDuration() }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="pt-0 pb-0">Auto</v-col>
      <v-col cols="8" class="pt-0 pb-0">
        {{ ride.car.brand }} {{ ride.car.model }}
      </v-col>
    </v-row>
    <v-row v-if="ride.recurrence">
      <v-col cols="4" class="pt-0 pb-0">Herhalen</v-col>
      <v-col cols="8" class="pt-0 pb-0">
        {{ formatRecurrence() }}
        <table v-if="ride.recurrence.unit == 'WEEK'" class="equal-width">
          <tr>
            <td>ma</td>
            <td>di</td>
            <td>wo</td>
            <td>do</td>
            <td>vr</td>
            <td>za</td>
            <td>zo</td>
          </tr>
          <tr>
            <td v-for="day in [0, 1, 2, 3, 4, 5, 6]" :key="day">
              <v-icon>
                {{ recursOn(day) ? 'done' : '' }}
              </v-icon>
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <v-divider class="mb-2" />
    <v-row>
      <v-col class="mx-6">
        <v-row v-for="(leg, index) in generateSteps()" :key="index">
          <itinerary-leg :leg="leg" />
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mx-1">
      <v-btn large rounded block outlined color="warning" @click="deleteTrip()">
        Reis annuleren
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'

export default {
  name: 'RideDetailPage',
  components: { ItineraryLeg },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // for now, assume the ride is always available (may change when deeplinking from a notification)
      ride: this.$store.getters['cs/getRides'].find(
        ride => ride.id === this.id
      ),
    }
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    formatDate() {
      return moment(this.ride.departureTime)
        .locale('nl')
        .format('dddd DD-MM-YYYY')
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
      return interval === 1 ? 'Wekelijks op' : `Elke ${interval} weken op`
    },
    recursOn(weekday) {
      return this.ride.recurrence.daysOfWeekMask & (1 << weekday)
    },
    generateSteps() {
      const { ride } = this
      const departure = moment(ride.departureTime),
        arrival = moment(ride.estimatedArrivalTime)
      return [
        {
          mode: 'CAR',
          startTime: departure.toDate().getTime(),
          endTime: arrival.toDate().getTime(),
          from: { name: ride.fromPlace.label },
        },
        {
          mode: 'ARRIVAL',
          startTime: arrival.toDate().getTime(),
          from: { name: ride.toPlace.label },
        },
      ]
    },
    deleteTrip() {
      console.log('delete trip', this.id)
      //En dan een call, plus dan een route terug naar de bewaarde ritten. Push een delete message
      this.$store.dispatch('cs/deleteRide', {
        id: this.id,
      })
      this.$router.push('/tripsOverviewPage')
    },
  },
}
</script>
<style scoped>
.departure-date {
  text-transform: lowercase;
}
.departure-date::first-letter {
  text-transform: uppercase;
}
.equal-width {
  width: 100%;
}
.equal-width td {
  width: 14.14%;
  text-align: center;
}
</style>
