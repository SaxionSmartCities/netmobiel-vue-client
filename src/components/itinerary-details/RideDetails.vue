<template>
  <v-row dense no-gutters>
    <v-col>
      <v-row v-if="selectedLegs && shouldShowMap">
        <v-col>
          <route-map
            ref="mapComp"
            :legs="selectedLegs"
            :map-size-prop="mapSize"
            :single-leg-dashed="false"
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
import constants from '@/constants/constants'
import { triStateLogicText } from '@/utils/Utils'

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
        (booking) => booking.state.toUpperCase() !== 'CANCELLED'
      )
    },
    confirmedBookings() {
      return this.ride.bookings?.filter(
        (booking) => booking.state.toUpperCase() === 'CONFIRMED'
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
      // eslint-disable-next-line no-unused-vars
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
      const booking = this.confirmedBookings[0]
      if (booking) {
        if (booking.fareInCredits !== undefined) {
          result.push({
            label: 'Opbrengst',
            value: `${booking.fareInCredits} credits`,
          })
        }
        if (
          this.ride?.state === 'VALIDATING' ||
          this.ride?.state === 'COMPLETED'
        ) {
          const cv = this.confirmationText(booking.confirmed)
          result.push({ label: 'Bevestiging', value: cv })
          if (booking.confirmed === false) {
            const reason = this.providerReasonText(booking.confirmationReason)
            result.push({ label: 'Reden', value: reason })
          }
        }
        if (booking.paymentState) {
          result.push({
            label: 'Betaling',
            value: constants.PAYMENT_STATE[booking.paymentState],
          })
        }
      }
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
    confirmationText(value) {
      return triStateLogicText(value)
    },
    providerReasonText(reasonCode) {
      return constants.DRIVER_TRIP_NOT_MADE_REASONS.find(
        (r) => r.value === reasonCode
      )?.title
    },
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
