<template>
  <v-card
    fluid
    outlined
    class="pa-1"
    :class="{ 'selected-offer': selected }"
    @click="$emit('booking-selected', index)"
  >
    <v-overlay
      :color="overlayColor"
      :value="displayOverlay"
      :absolute="true"
      opacity="0.08"
      z-index="99"
    />
    <v-row>
      <v-col class="shrink">
        <external-user-image
          :managed-identity="booking.passenger.managedIdentity"
          :image-size="54"
          :avatar-size="60"
          :class="{ 'selected-booking': selected }"
        />
      </v-col>
      <v-col :class="{ 'text-decoration-line-through': cancelled }">
        <p class="subtitle-1 mb-0">
          {{ booking.passenger.givenName }} {{ booking.passenger.familyName }}
        </p>
        <p class="caption mb-0">
          <span>Ophalen: </span>
          <span class="text-capitalize">
            {{ formatDateTime(booking.departureTime) }}
          </span>
          <span> - Afzetten: </span>
          <span class="text-capitalize">
            {{ formatDateTime(booking.arrivalTime) }}
          </span>
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from 'moment'
import { TIME_FORMAT } from '@/utils/datetime.js'
import ExternalUserImage from '@/components/profile/ExternalUserImage'

export default {
  name: 'BookingSummary',
  components: { ExternalUserImage },
  props: {
    index: { type: Number, required: true },
    booking: { type: Object, required: true },
    selected: { type: Boolean, required: true, default: false },
  },
  computed: {
    displayOverlay() {
      return this.cancelled
    },
    // HACK: Should be done using CSS.
    overlayColor() {
      if (this.cancelled) {
        return '#d0021b'
      }
      return ''
    },
    cancelled() {
      return this.booking.state.toUpperCase() === 'CANCELLED'
    },
  },
  methods: {
    formatDateTime(date) {
      return moment(date).format(TIME_FORMAT)
    },
  },
}
</script>

<style lang="scss">
.selected-booking {
  border-color: $color-primary !important;
  background-color: $background-light-green !important;
}
</style>
