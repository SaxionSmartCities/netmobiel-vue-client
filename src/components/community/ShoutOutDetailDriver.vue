<template>
  <v-row dense>
    <v-col class="pa-0">
      <v-row>
        <v-col class="pt-0 pb-4">
          <h4>Jouw aanboden rit:</h4>
        </v-col>
      </v-row>
      <v-row
        v-for="(leg, index) in generateSteps()"
        :key="index"
        class="mx-1 py-0"
      >
        <itinerary-leg :leg="leg" :showicon="true" :showdottedline="false" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import { generateShoutOutDetailSteps } from '@/utils/itinerary_steps.js'

export default {
  name: 'ShoutOutDetailDriver',
  components: {
    ItineraryLeg,
  },
  props: {
    ride: { type: Object, required: true },
  },
  methods: {
    generateSteps() {
      const shoutout = { ride: { ...this.ride } }
      return generateShoutOutDetailSteps(shoutout)
    },
  },
}
</script>
