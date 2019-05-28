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
            <v-flex v-for="step in journey.steps" :key="step.id">
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
            <!-- <v-flex xs2>
              <travel-step>directions_walk</travel-step>
            </v-flex>
            <v-flex xs4>
              <travel-step>directions_car</travel-step>
            </v-flex>
            <v-flex>
              <travel-step>directions_bus</travel-step>
            </v-flex>
            <v-flex>
              <travel-step>train</travel-step>
            </v-flex> -->
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
            time: 35,
          },
        ],
        costs: 5,
        departureTime: '09:30',
      },
    }
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
  },
}
</script>

<style lang="scss">
.travel-card {
  border-radius: 10px;
  border: 1px $color-inputGray solid;
}
</style>
