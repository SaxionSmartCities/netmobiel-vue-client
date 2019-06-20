<template>
  <v-container>
    <v-layout id="pagina" column>
      <v-flex mb-3>
        <h3>Reisdetails</h3>
      </v-flex>

      <v-flex>
        <v-divider />
      </v-flex>

      <v-flex my-2>
        <itinerary-summary
          :date="journey.startTime"
          :cost="5"
          :duration="journey.duration"
        >
        </itinerary-summary>
      </v-flex>

      <v-flex>
        <v-divider />
      </v-flex>

      <v-flex id="legs" mt-4>
        <v-layout column>
          <v-flex v-for="(leg, index) in generateSteps" :key="index">
            <itinerary-leg :leg="leg" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex my-4>
        <v-btn large round block mb-4 @click="debugThis()">
          Deze reis bevestigen
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ItinerarySummary from '@/views/itinerary-details/ItinerarySummary.vue'
import ItineraryLeg from '@/views/itinerary-details/ItineraryLeg.vue'

export default {
  name: 'ItineraryDetailPage',
  components: { ItinerarySummary, ItineraryLeg },
  computed: {
    journey: function() {
      return this.$store.getters.getSelectedItinerary
    },
    generateSteps: function() {
      let result = []

      for (let i = 0; i < this.journey.legs.length - 1; i++) {
        let currentLeg = this.journey.legs[i]
        let nextLeg = this.journey.legs[i + 1]

        result.push(currentLeg)

        // We won't show any waiting times < 60 sec
        if (nextLeg.startTime - currentLeg.endTime > 60 * 1000) {
          // There is some time to wait!
          result.push({
            mode: 'WAIT',
            startTime: currentLeg.endTime,
            endTime: nextLeg.startTime,
            duration: (nextLeg.startTime - currentLeg.endTime) / 1000,
          })
        }
      }

      let lastLeg = this.journey.legs[this.journey.legs.length - 1]

      result.push(lastLeg)

      result.push({
        mode: 'FINISH',
        startTime: lastLeg.endTime,
        to: lastLeg.to,
      })

      console.log(result)
      return result
    },
  },
  methods: {
    debugThis: function() {
      console.log(this.generateSteps)
    },
  },
}
</script>

<style lang="scss"></style>
