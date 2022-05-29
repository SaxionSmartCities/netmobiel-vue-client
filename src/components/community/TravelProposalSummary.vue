<template>
  <v-card
    fluid
    outlined
    class="pa-1"
    :class="{ 'selected-offer': selected }"
    @click="$emit('travel-proposal-selected', index)"
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
        <driver-image
          :avatar-size="60"
          :image-size="56"
          :leg="leg"
          :class="{ 'selected-offer': selected }"
        />
      </v-col>
      <v-col :class="{ 'text-decoration-line-through': cancelled }">
        <p class="subtitle-1 mb-0">
          {{ driverName }}
        </p>
        <p class="caption mb-0">
          <span>Instappen: </span>
          <span class="text-capitalize">
            {{ formatDateTime(itinerary.departureTime) }}
          </span>
          <span> - Uitstappen: </span>
          <span class="text-capitalize">
            {{ formatDateTime(itinerary.arrivalTime) }}
          </span>
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import moment from 'moment'
import { TIME_FORMAT } from '@/utils/datetime.js'
import DriverImage from '@/components/itinerary-details/DriverImage'

export default {
  name: 'TravelProposalSummary',
  components: { DriverImage },
  props: {
    index: { type: Number, required: true },
    itinerary: { type: Object, required: true },
    selected: { type: Boolean, required: true, default: false },
  },
  computed: {
    driverName() {
      return this.leg ? this.leg.driverName : 'Chauffeur'
    },
    leg() {
      return this.itinerary.legs.find((l) => l.agencyId === 'NB:RS')
    },
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
      return this.leg?.state === 'CANCELLED'
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
.selected-offer {
  border-color: $color-primary !important;
  background-color: $background-light-green !important;
}
</style>
