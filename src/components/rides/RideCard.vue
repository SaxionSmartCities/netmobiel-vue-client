<template>
  <v-container travel-card>
    <v-row align="center">
      <v-col cols="11">
        <v-row align="center" class="body-2">
          <v-col cols="7" class="pt-0 pb-0">
            <div v-if="ride.recurrence">
              <v-icon>replay</v-icon>
              {{ formatRecurrence(ride) }}
            </div>
          </v-col>
          <v-col cols="5" class="text-right pt-0 pb-0">
            {{ ride.bookings.length }} passagiers
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="font-weight-bold pt-0 pb-0">Vertrek</v-col>
          <v-col cols="8" class="pt-0 pb-0 text-overflow-with-ellipsis">
            {{ formatTime(ride.departureTime) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="font-weight-bold pt-0 pb-0">Reisduur</v-col>
          <v-col cols="8" class="pt-0 pb-0 text-overflow-with-ellipsis">
            {{ formatDuration(ride.estimatedDrivingTime) }}
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

<!--
  <v-layout>
    <v-flex travel-card pa-3>
      <v-layout column>
        <v-flex>
          <v-layout>
            <v-flex>
              <h3>Vertrek</h3>
              <p class="first-letter-caps mb-0 font-weight-light">
                {{ formatTime(ride.departureTime) }}
              </p>
            </v-flex>
            <v-flex grow>
              <v-layout shrink justify-end>
                <v-flex class="align-right body-2 font-weight-light">
                  Geen passagiers
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout pt-2 column>
            <v-flex pa-0 pb-1>
              <v-icon>directions_car</v-icon>
            </v-flex>
            <v-flex><div class="travel-line"></div></v-flex>
            <v-flex mt-2 mb-2 body-2 font-weight-light>
              Naar {{ formatPlace(ride.toPlace.label) }}
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex d-flex>
      <v-layout justify-center align-center column>
        <v-flex shrink>
          <v-icon @click="openDetails()">keyboard_arrow_right</v-icon>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
-->
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
    formatTime(time) {
      return moment(time)
        .locale('nl')
        .calendar()
    },
    formatDuration(seconds) {
      const minutes = Math.round(seconds / 60)
      return minutes < 60
        ? `${minutes} minuten`
        : `${Math.floor(minutes / 60)} uur ${minutes % 60} minuten`
    },
    formatRecurrence(ride) {
      const { unit, interval } = ride.recurrence
      if (unit === 'DAY') {
        return 'Dagelijks'
      }
      const weekday = moment(ride.departureTime)
          .locale('nl')
          .format('dd'),
        weekly = interval === 1 ? 'Wekelijks' : `Elke ${interval} weken`
      return `${weekly} op ${weekday}`
    },
  },
}
</script>
