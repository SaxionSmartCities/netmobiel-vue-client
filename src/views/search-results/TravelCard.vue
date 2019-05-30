<template>
  <v-layout travel-card pt-3 pb-3 pl-3 pr-1>
    <v-flex id="allesbehalveknopje" xs11>
      <v-layout column>
        <v-flex id="vertrekreismet">
          <v-layout>
            <v-flex id="vertrek">
              <h4>Vertrek</h4>
              {{ journey.departureTime }}
            </v-flex>
            <v-flex id="reizenmet" text-xs-right pr-1>
              <h4>Reizen met</h4>
              Henk
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="schematischoverzicht" mt-3>
          <v-layout>
            <v-flex
              v-for="(step, index) in journey.steps"
              :key="index"
              :class="calculateClass(index)"
            >
              <travel-step
                v-if="step.mode.type === 'car'"
                :max-rating="3"
                :current-rating="step.mode.driver.rating"
              >
                {{ getIcon(step.mode.type) }}
              </travel-step>
              <travel-step v-else>
                {{ getIcon(step.mode.type) }}
              </travel-step>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="tijdkosten" mt-2>
          <v-layout>
            <v-flex id="tijd">
              55 minuten
            </v-flex>
            <v-flex id="kosten" text-xs-right pr-1>
              5 credits
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex id="knopje" d-flex>
      <v-layout justify-center align-center column>
        <v-flex shrink>
          <v-icon>keyboard_arrow_right</v-icon>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import TravelStep from '@/views/search-results/TravelStep.vue'

export default {
  name: 'TravelCard',
  components: {
    TravelStep,
  },
  data: function() {
    return {
      journey: {
        journeyId: 12345,
        steps: [
          {
            id: 0,
            mode: { type: 'walk' },
            time: 5,
          },
          {
            id: 1,
            mode: {
              type: 'car',
              driver: {
                name: 'Henk',
                rating: 2.6,
              },
            },

            time: 15,
          },
          {
            id: 2,
            mode: { type: 'bus', line: 144 },
            time: 5,
          },
        ],
        costs: 5,
        departureTime: '09:30',
      },
      layoutRatios: [],
    }
  },
  mounted: function() {
    this.calculateStepDivison()
  },
  methods: {
    getIcon: function(type) {
      switch (type) {
        case 'walk':
          return 'directions_walk'
        case 'car':
          return 'directions_car'
        case 'train':
          return 'train'
        case 'bus':
          return 'directions_bus'
      }
    },
    // Function to pre-determine the divions of columsn per step
    calculateStepDivison: function() {
      // Calculate total travel time
      let totalTime = 0
      this.journey.steps.forEach(element => {
        totalTime += element.time
      })

      // Calculate ratio for each step and map it on a 1-12 scale (based on grid system)
      let ratios = []
      this.journey.steps.forEach(element => {
        let currentRatio = element.time / totalTime // Calculate weight of value i.c.t. other values
        let mappedRatio = currentRatio * 12 // Map over 12 columns
        let pushValue = Math.max(1, mappedRatio) // Make sure the minimum value is 1 - otherwise it won't be displayed

        ratios.push(Math.round(pushValue))
      })

      // We need to check whether we fill all 12 columns (because of grid).
      // As there is no guarantee that we have exactly 12 columsn filled (because of rounding and min. of 1 column for all steps),
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
  },
}
</script>

<style lang="scss">
.travel-card {
  border-radius: 10px;
  border: 1px $color-inputGray solid;
}
</style>
