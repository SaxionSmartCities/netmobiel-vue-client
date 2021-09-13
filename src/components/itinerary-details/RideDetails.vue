<template>
  <v-row dense class="d-flex flex-column">
    <v-col><h1>Ritdetails</h1></v-col>
    <v-col><v-divider /></v-col>
    <v-col class="py-0">
      <itinerary-summary-list :items="items" />
    </v-col>
    <v-col><v-divider /></v-col>
  </v-row>
</template>

<script>
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import { formatDateTimeLongNoYear } from '@/utils/datetime.js'

export default {
  name: 'RideDetails',
  components: { ItinerarySummaryList },
  props: {
    ride: { type: Object, required: true },
  },
  computed: {
    activeBookings() {
      return this.ride.bookings?.filter(
        booking => booking.state.toUpperCase() !== 'CANCELLED'
      )
    },
    confirmedBookings() {
      return this.ride.bookings?.filter(
        booking => booking.state.toUpperCase() === 'CONFIRMED'
      )
    },
    bookingLabel() {
      let label = 'Geen'
      if (this.confirmedBookings?.length > 0) {
        label = `${this.confirmedBookings.length}`
      } else if (this.activeBookings?.length > 0) {
        label = `${this.activeBookings.length} (voorgesteld)`
      }
      return label
    },
    items() {
      let result = []
      if (!this.ride.rideRef) {
        return result
      }
      const { departureTime, duration, bookings, car, recurrence } = this.ride
      result.push({
        label: 'Datum',
        value: formatDateTimeLongNoYear(departureTime),
      })
      if (duration) {
        const reisduur = `${Math.round(duration / 60)} minuten`
        result.push({ label: 'Reisduur', value: reisduur })
      }
      const auto = car
        ? `${this.ride.car.brand} ${this.ride.car.model}`
        : 'Onbekend'
      result.push({ label: 'Auto', value: auto })
      // result.push({
      //   label: 'Boekingen',
      //   value: bookings,
      //   renderingComponent: 'BookingList',
      // })
      const bookingLabel = this.bookingLabel
      result.push({
        label: 'Boekingen',
        value: bookingLabel,
      })
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
