<template>
  <v-container fluid pa-0>
    <v-card
      fluid
      outlined
      :class="{ 'selected-offer': selected }"
      @click="$emit('travel-proposal-selected', index)"
    >
      <v-row>
        <v-col class="shrink ml-2 mr-0 pr-0">
          <driver-image
            :avatar-size="60"
            :image-size="56"
            :leg="leg"
            :class="{ 'selected-offer': selected }"
          />
        </v-col>
        <v-col>
          <p class="font-weight-regular header mb-0">
            {{ driver }}
          </p>
          <p class="font-weight-light subtitle-1 mb-0">
            <span>Vertrek: </span>
            <span class="text-capitalize">
              {{ formatDateTime(itinerary.departureTime) }}
            </span>
            <span> - Aankomst: </span>
            <span class="text-capitalize">
              {{ formatDateTime(itinerary.arrivalTime) }}
            </span>
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
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
    driver() {
      const { leg } = this
      return leg ? leg.driverName : 'Chauffeur'
    },
    leg() {
      return this.itinerary.legs.find(l => l.agencyId === 'NB:RS')
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
