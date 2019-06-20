<template>
  <v-layout travel-card pt-3 pb-3 pl-3 pr-1>
    <v-flex xs11>
      <v-layout column>
        <v-flex>
          <v-layout>
            <v-flex>
              <h4>Vertrek</h4>
              {{ departureTime }}
            </v-flex>
            <v-flex v-if="hasCarLeg()" text-xs-right pr-1>
              <h4>Reizen met</h4>
              {{ getDriversString() }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex mt-3>
          <v-layout>
            <v-flex
              v-for="(leg, index) in journey.legs"
              :key="index"
              :class="calculateClass(index)"
            >
              <travel-leg :leg="leg"> </travel-leg>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex mt-2>
          <v-layout>
            <v-flex> {{ Math.round(journey.duration / 60) }} minuten </v-flex>
            <v-flex text-xs-right pr-1> {{ journey.cost }} credits </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex d-flex>
      <v-layout justify-center align-center column>
        <v-flex shrink>
          <v-icon @click="openDetails()">keyboard_arrow_right</v-icon>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import TravelLeg from '@/views/search-results/TravelLeg.vue'

export default {
  name: 'TravelCard',
  components: {
    TravelLeg,
  },
  props: {
    journey: {
      type: Object,
      required: true,
      default: function() {
        return {}
      },
    },
  },
  data: function() {
    return {
      layoutRatios: [],
      totalTime: 0,
    }
  },
  computed: {
    departureTime: function() {
      return moment(this.journey.startTime)
        .locale('nl')
        .calendar()
    },
    getDriversString: function() {
      let drivers = []

      for (let i = 0; i < this.journey.legs.length; i++) {
        let currentLeg = this.journey.legs[i]

        if (currentLeg.mode === 'NETMOBIEL') {
          result.push(currentLeg.mode.driver.name)
        }
      }

      if (drivers.length === 1) {
        return drivers[0]
      }

      let result = ''

      for (var i = 0; i < drivers.length - 1; i++) {
        result += drivers[i]
        result += ', '
      }

      result += drivers[i]

      return result
    },
  },
  mounted: function() {
    this.calculateLegDivison()
  },
  methods: {
    // Function to pre-determine the divions of column per leg
    calculateLegDivison: function() {
      // Calculate total travel time
      this.journey.legs.forEach(element => {
        this.totalTime += element.duration
      })

      // Calculate ratio for each leg and map it on a 1-12 scale (based on grid system)
      let ratios = []
      this.journey.legs.forEach(element => {
        let currentRatio = element.duration / this.totalTime // Calculate weight of value i.c.t. other values
        let mappedRatio = currentRatio * 12 // Map over 12 columns
        let pushValue = Math.max(1, mappedRatio) // Make sure the minimum value is 1 - otherwise it won't be displayed

        ratios.push(Math.round(pushValue))
      })

      // We need to check whether we fill all 12 columns (because of grid).
      // As there is no guarantee that we have exactly 12 columns filled (because of rounding and min. of 1 column for all legs),
      // we need to confirm this manually.
      // We'll sum up the ratios array (which should be 12) and adjust if need be. We'll pick the (first) largest
      // value in the array (== biggest column visually) apply the difference to it..
      let sum = 0
      ratios.forEach(element => {
        sum += element
      })

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
    calculateClass: function(index) {
      return 'xs' + this.layoutRatios[index]
    },
    hasCarLeg: function() {
      for (var i = 0; i < this.journey.legs.length; i++) {
        let currentLeg = this.journey.legs[i]

        if (currentLeg.mode.type === 'car') {
          return true
        }
      }

      return false
    },
    openDetails: function() {
      console.log(this.journey)
      this.$router.push('travelDetails')
    },
  },
}
</script>

<style lang="scss">
.travel-card {
  border-radius: 10px;
  border: 1px $color-inputGray solid;
}
</style>
