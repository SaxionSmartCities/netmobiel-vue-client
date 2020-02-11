<template>
  <v-card outlined @click="$emit('onTripSelected', index)">
    <v-row no-gutters>
      <v-col>
        <v-card-title>
          <h4>Vertrek</h4>
        </v-card-title>
        <v-card-subtitle>
          {{ formatDateTime(departureTime) }}
        </v-card-subtitle>
        <v-card-text>
          <v-row no-gutters class="pb-2">
            <v-col
              v-for="(leg, indx) in legs"
              :key="indx"
              :cols="calculateWidth(indx)"
            >
              <travel-leg :leg="leg"> </travel-leg>
            </v-col>
          </v-row>
          <div v-if="duration">
            Reistijd: {{ Math.round(duration / 60) }} minuten
          </div>
        </v-card-text>
      </v-col>
      <v-card-actions>
        <v-icon>keyboard_arrow_right</v-icon>
      </v-card-actions>
    </v-row>
  </v-card>
</template>

<script>
import moment from 'moment'
import TravelLeg from '@/components/search-results/TravelLeg.vue'

export default {
  name: 'TravelCard',
  components: {
    TravelLeg,
  },
  props: {
    index: { type: Number, required: true },
    from: { type: Object, required: true },
    to: { type: Object, required: true },
    arrivalTime: { type: Object, required: true },
    departureTime: { type: Object, required: true },
    duration: { type: Number, required: false, default: 0 },
    legs: { type: Array, required: true },
  },
  data() {
    return {
      layoutRatios: [],
      totalTime: 0,
    }
  },
  mounted() {
    this.calculateLegDivison()
  },
  methods: {
    formatDateTime(dateTime) {
      return moment(dateTime)
        .locale('nl')
        .calendar()
    },
    // Function to pre-determine the divions of column per leg
    calculateLegDivison() {
      // Skip calculation if we have no legs.
      if (this.legs.length == 0) {
        return
      }
      // Calculate total travel time
      this.totalTime = this.legs
        .map(leg => leg.duration)
        .reduce((a, b) => a + b)

      // Calculate ratio for each leg and map it on a 1-12 scale (based on grid system)
      let ratios = []
      for (let i = 0, len = this.legs.length; i < len; i++) {
        let currentRatio = this.legs[i].duration / this.totalTime // Calculate weight of value i.c.t. other values
        let mappedRatio = currentRatio * 12 // Map over 12 columns
        let pushValue = Math.max(1, mappedRatio) // Make sure the minimum value is 1 - otherwise it won't be displayed

        ratios.push(Math.round(pushValue))
      }

      // We need to check whether we fill all 12 columns (because of grid).
      // As there is no guarantee that we have exactly 12 columns filled (because of rounding and min. of 1 column for all legs),
      // we need to confirm this manually.
      // We'll sum up the ratios array (which should be 12) and adjust if need be. We'll pick the (first) largest
      // value in the array (== biggest column visually) apply the difference to it..
      let sum = ratios.reduce((a, b) => a + b)

      if (sum !== 12) {
        let difference = 12 - sum // This can either be positive or negative.

        // Find the highest value. We'll need to adjust this value to reach 12.
        let highestIndex = 0
        for (var i = 0; i < ratios.length; i++) {
          if (ratios[i] > ratios[highestIndex]) {
            highestIndex = i
          }
        }
        // Adjust the widest column visually..
        ratios[highestIndex] += difference
      }
      this.layoutRatios = ratios
    },
    calculateWidth(index) {
      return this.layoutRatios[index]
    },
  },
}
</script>

<style lang="scss"></style>
