<template>
  <div>
    <v-row justify="space-between" dense>
      <v-col class="py-0 shrink">
        {{ label }}
      </v-col>
      <v-col v-if="activeBookings.length > 0" class="py-0 shrink">
        <v-btn color="primary" icon @click="expandBookings = !expandBookings">
          <v-icon>
            {{ !expandBookings ? 'expand_more' : 'expand_less' }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <ul v-if="expandBookings" class="body-2 pl-4">
      <li v-for="booking in activeBookings" :key="booking.bookingRef">
        {{ booking.passenger.givenName + ' ' + booking.passenger.familyName }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BookingList',
  props: {
    bookingList: { type: Array, default: () => [] },
  },
  data() {
    return {
      expandBookings: false,
    }
  },
  computed: {
    activeBookings() {
      return this.bookingList.filter(
        booking => booking.state.toUpperCase() !== 'CANCELLED'
      )
    },
    confirmedBookings() {
      return this.bookingList.filter(
        booking => booking.state.toUpperCase() === 'CONFIRMED'
      )
    },
    label() {
      let label = 'Geen'
      if (this.confirmedBookings.length > 0) {
        label = this.confirmedBookings.length
      } else if (this.activeBookings.length > 0) {
        label = `${this.activeBookings.length} (voorstel)`
      }
      return label
    },
  },
}
</script>
