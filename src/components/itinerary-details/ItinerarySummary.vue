<template>
  <v-row>
    <v-col>
      <v-row no-gutters>
        <v-col cols="3" class="bold">Datum</v-col>
        <v-col class="departure-date pl-3">{{ printableDate }}</v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="3" class="bold">Reisduur</v-col>
        <v-col class="pl-3">{{ Math.round(duration / 60) }} minuten</v-col>
      </v-row>
      <v-row v-if="luggageTypes.length > 0" no-gutters>
        <v-col cols="3" class="bold">Baggage</v-col>
        <v-col class="pl-3">{{ luggageTypes }}</v-col>
      </v-row>
      <v-row v-if="cost" no-gutters>
        <v-col cols="3" class="bold">Kosten</v-col>
        <v-col class="pl-3">{{ cost }} credits</v-col>
      </v-row>
      <v-row v-if="revenue" no-gutters>
        <v-col cols="3" class="bold">Opbrengst</v-col>
        <v-col class="pl-3">{{ revenue }} credits</v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ItinerarySummary',
  components: {},
  props: {
    date: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    luggageTypes: { type: Array, default: () => [] },
    revenue: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
  },
  computed: {
    printableDate() {
      return moment(this.date)
        .locale('nl')
        .format('dddd DD-MM-YYYY')
    },
  },
}
</script>

<style scoped>
.bold {
  font-weight: 400;
}
.departure-date {
  text-transform: lowercase;
  padding-left: 0;
}
.departure-date::first-letter {
  text-transform: uppercase;
}
</style>
