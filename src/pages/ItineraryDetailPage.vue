<template>
  <content-pane>
    <v-layout py-2 column>
      <v-flex mb-3>
        <h3>Reisdetails</h3>
      </v-flex>
      <v-flex>
        <v-divider />
      </v-flex>
      <v-flex my-2>
        <itinerary-summary
          :date="parseInt(selectedTrip.itinerary.startTime)"
          :cost="5"
          :duration="selectedTrip.itinerary.duration"
        >
        </itinerary-summary>
      </v-flex>
      <v-flex>
        <v-divider />
      </v-flex>
      <v-flex mt-4 mx-3>
        <v-layout column>
          <v-flex v-for="(leg, index) in generateSteps" :key="index">
            <itinerary-leg :leg="leg" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex my-4>
        <v-btn large rounded block mb-4 @click="saveTrip">
          Deze reis bevestigen
        </v-btn>
      </v-flex>
    </v-layout>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'

export default {
  name: 'ItineraryDetailPage',
  components: { ContentPane, ItinerarySummary, ItineraryLeg },
  computed: {
    selectedTrip: function() {
      return this.$store.getters['is/getSelectedTrip']
    },
    generateSteps: function() {
      let result = []
      for (let i = 0; i < this.selectedTrip.itinerary.legs.length - 1; i++) {
        let currentLeg = this.selectedTrip.itinerary.legs[i]
        let nextLeg = this.selectedTrip.itinerary.legs[i + 1]
        result.push(currentLeg)

        // We won't show any waiting times < 60 sec -- should be made a config
        if (nextLeg.startTime - currentLeg.endTime > 60 * 1000) {
          // Add "WAIT" element (not from OTP).
          result.push({
            mode: 'WAIT',
            startTime: currentLeg.endTime,
            endTime: nextLeg.startTime,
            duration: (nextLeg.startTime - currentLeg.endTime) / 1000,
          })
        }
      }
      let lastLeg = this.selectedTrip.itinerary.legs[
        this.selectedTrip.itinerary.legs.length - 1
      ]
      result.push(lastLeg)

      // Finally, we push the "FINISH" element (not from OTP)
      result.push({
        mode: 'FINISH',
        startTime: lastLeg.endTime,
        to: lastLeg.to,
      })
      return result
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    saveTrip: function() {
      const selectedTrip = this.$store.getters['is/getSelectedTrip']
      this.$store.dispatch('is/storeSelectedTrip', selectedTrip)
    },
  },
}
</script>

<style lang="scss"></style>
