<template>
  <v-card outlined>
    <v-row no-gutters>
      <v-col>
        <v-card-title class="py-2">
          <v-row no-gutters>
            <v-col class="d-flex justify-space-between subtitle-1">
              <span>Vertrek</span>
              <span class="capitalize">
                {{ formatDateTime(itinerary.departureTime) }}
              </span>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="d-flex justify-space-between subtitle-1">
              <span>Aankomst</span>
              <span class="capitalize">
                {{ formatDateTime(itinerary.arrivalTime) }}
              </span>
            </v-col>
          </v-row>
        </v-card-title>
      </v-col>
      <v-card-actions>
        <v-icon>keyboard_arrow_right</v-icon>
      </v-card-actions>
    </v-row>
  </v-card>
</template>

<script>
import moment from 'moment'
import { TIMESTAMP_FORMAT } from '@/utils/datetime.js'

export default {
  name: 'TravelProposalSummary',
  props: {
    index: { type: Number, required: true },
    itinerary: { type: Object, required: true },
  },
  methods: {
    formatDateTime(date) {
      return moment(date).format(TIMESTAMP_FORMAT)
    },
  },
}
</script>

<style lang="scss">
.capitalize {
  text-transform: lowercase;
}
.capitalize::first-letter {
  text-transform: uppercase;
}
</style>
