<template>
  <v-row dense no-gutters>
    <v-col>
      <v-row v-if="selectedLegs && shouldShowMap" class="pa-0">
        <v-col class="pa-0">
          <route-map
            ref="mapComp"
            :legs="selectedLegs"
            :map-size-prop="mapSize"
            @sizeChanged="onMapSizeChanged"
            @closeMap="onMapClose"
          >
          </route-map>
        </v-col>
      </v-row>
      <v-row dense class="d-flex flex-column">
        <v-col><h1>Ritdetails</h1></v-col>
        <v-col><v-divider /></v-col>
        <v-col class="py-0">
          <itinerary-summary-list :items="items" />
        </v-col>
        <v-col><v-divider /></v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import { formatDateTimeLongNoYear } from '@/utils/datetime.js'
import RouteMap from '@/components/itinerary-details/RouteMap'

export default {
  name: 'RideDetails',
  components: { ItinerarySummaryList, RouteMap },
  props: {
    ride: { type: Object, required: true },
    showMap: { type: Boolean, default: false },
  },
  data() {
    return {
      mapSize: 'small',
    }
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
    shouldShowMap() {
      return this.showMap
    },
    selectedLegs() {
      return this.ride?.legs
    },
  },
  methods: {
    onMapSizeChanged({ size }) {
      this.mapSize = size
    },
    onMapClose() {
      this.selectedLegsIndex = null
      this.mapSize = 'small'
      this.$emit('closeMap')
    },
  },
}
</script>
