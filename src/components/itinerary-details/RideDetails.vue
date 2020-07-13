<template>
  <v-row dense class="d-flex flex-column">
    <v-col><h1>Rit details</h1></v-col>
    <v-col><v-divider /></v-col>
    <v-col class="py-0">
      <itinerary-summary-list :items="items" />
    </v-col>
    <v-col><v-divider /></v-col>
  </v-row>
</template>

<script>
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import { formatDateTimeLong } from '@/utils/datetime.js'

export default {
  name: 'RideDetails',
  components: { ItinerarySummaryList },
  props: {
    ride: { type: Object, required: true },
  },
  computed: {
    items() {
      let result = []
      const { departureTime, duration, bookings, car, recurrence } = this.ride
      result.push({ label: 'Datum', value: formatDateTimeLong(departureTime) })
      if (duration) {
        const reisduur = `${Math.round(duration / 60)} minuten`
        result.push({ label: 'Reisduur', value: reisduur })
      }
      const boekingen =
        !!bookings && bookings.length > 0 ? bookings.length : 'Geen'
      result.push({ label: 'Boekingen', value: boekingen })
      const auto = car
        ? `${this.ride.car.brand} ${this.ride.car.model}`
        : 'Onbekend'
      result.push({ label: 'Auto', value: auto })
      if (recurrence) {
        result.push({
          label: 'Herhalen',
          value: recurrence,
          renderingComponent: 'RecurrenceViewer',
        })
      }
      return result
    },
  },
}
</script>
