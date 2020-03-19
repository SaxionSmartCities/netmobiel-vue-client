<template>
  <content-pane>
    <v-row dense class="pa-0">
      <v-col class="mb-3 py-0">
        <h1>Reis details</h1>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="py-0">
        <v-divider />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">Datum</v-col>
      <v-col cols="8" class="departure-date">
        {{ formatDate() }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">Reisduur</v-col>
      <v-col cols="8">
        {{ formatDuration() }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">Baggage</v-col>
      <v-col cols="8">
        TODO
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">Opbrengst</v-col>
      <v-col cols="8">
        TODO credits
      </v-col>
    </v-row>
    <v-row class="pb-3">
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row
      v-for="(leg, index) in generateSteps()"
      :key="index"
      class="mx-3 py-0"
    >
      <itinerary-leg :leg="leg" />
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          block
          mb-4
          depressed
          color="button"
          @click="saveTrip"
        >
          Rit aanbieden
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mx-1">
        <v-btn large rounded block outlined color="primary" to="/community">
          Bericht sturen naar passagier
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ContentPane from '@/components/common/ContentPane.vue'

export default {
  name: 'ShoutoutDetailPage',
  components: { ContentPane, ItineraryLeg },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ride: null,
    }
  },
  mounted() {
    //TODO: Now hardcoded first ride.
    this.ride = this.$store.getters['cs/getRides'][0]
    console.log(this.ride)
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    formatDate() {
      return this.ride.departureTime
        ? moment(this.ride.departureTime)
            .locale('nl')
            .format('dddd DD-MM-YYYY')
        : ''
    },
    formatDuration() {
      const seconds = this.ride.estimatedDrivingTime,
        minutes = Math.round(seconds / 60)
      return minutes < 60
        ? `${minutes} minuten`
        : `${Math.floor(minutes / 60)} uur ${minutes % 60} minuten`
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
