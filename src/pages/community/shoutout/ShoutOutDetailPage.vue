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
          @click="bookTrip"
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
        <v-btn large rounded block outlined color="primary" :to="tripEdit()">
          Wijzigen
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ContentPane from '@/components/common/ContentPane.vue'

export default {
  name: 'ShoutOutDetailPage',
  components: { ContentPane, ItineraryLeg },
  props: {
    id: { type: Number, required: true },
  },
  data() {
    return {
      ride: null,
    }
  },
  computed: {
    ...mapGetters({
      selectedTrip: 'is/getSelectedTrip',
    }),
  },
  mounted() {
    this.$store.dispatch('is/fetchTrip', { id: this.id })
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    bookTrip() {
      //TODO:
    },
    tripEdit() {
      this.$router.push({
        name: 'tripUpdate',
        params: { tripId: this.selectedTrip.tripdId },
        query: { shoutOut: false },
      })
    },
    formatDate() {
      return this.selectedTrip.departureTime
        ? moment(this.selectedTrip.departureTime)
            .locale('nl')
            .format('dddd DD-MM-YYYY')
        : ''
    },
    formatDuration() {
      return '?'
    },
    generateSteps() {
      const { selectedTrip } = this
      const departure = moment(selectedTrip.departureTime),
        arrival = moment(selectedTrip.estimatedArrivalTime)
      const from = selectedTrip.from ? selectedTrip.from.label : '',
        to = selectedTrip.to ? selectedTrip.to.label : ''
      return [
        {
          mode: 'CAR',
          startTime: departure.toDate().getTime(),
          endTime: arrival.toDate().getTime(),
          from: { name: from },
        },
        {
          mode: 'ARRIVAL',
          startTime: arrival.toDate().getTime(),
          from: { name: to },
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
