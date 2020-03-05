<template>
  <content-pane>
    <v-container py-2 column>
      <v-row mb-3>
        <h1>Reisdetails</h1>
      </v-row>
      <v-row mb-3>
        <v-divider />
      </v-row>
      <v-row my-2>
        <itinerary-summary
          :date="selectedTrip.departureTime"
          :cost="5"
          :duration="selectedTrip.duration"
        >
        </itinerary-summary>
      </v-row>
      <v-row>
        <v-divider />
      </v-row>
      <v-row mt-4 mx-3>
        <v-layout column>
          <v-flex v-if="generateSteps.length == 0">
            Shoutout
          </v-flex>
          <v-flex v-for="(leg, index) in generateSteps" v-else :key="index">
            <itinerary-leg :leg="leg" />
          </v-flex>
        </v-layout>
      </v-row>
      <v-row my-4>
        <v-btn
          v-show="showSection"
          large
          rounded
          block
          mb-4
          depressed
          color="button"
          @click="saveTrip"
        >
          Deze reis bevestigen
        </v-btn>
      </v-row>
      <v-container v-if="selectedTrip.state === 'SCHEDULED'">
        <v-row>
          <v-col cols="12">
            <v-btn
              to="/conversation/1"
              large
              rounded
              outlined
              block
              mb-4
              depressed
              color="primairy"
              @click="contactDriver"
            >
              Stuur bericht naar henk
            </v-btn>
          </v-col>
        </v-row>
        <v-row my-4>
          <v-col cols="12">
            <v-btn
              large
              rounded
              outlined
              block
              mb-4
              depressed
              color="primairy"
              @click="showMap"
            >
              Bekijk op de kaart
            </v-btn>
          </v-col>
        </v-row>
        <v-row mb-3>
          <v-col cols="12">
            <h1>Wijzigen</h1>
          </v-col>
        </v-row>
        <itinerary-options></itinerary-options>
      </v-container>
    </v-container>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'

export default {
  name: 'ItineraryDetailPage',
  components: { ContentPane, ItinerarySummary, ItineraryLeg, ItineraryOptions },
  data: function() {
    return {
      showConfirmationButton: true,
    }
  },
  computed: {
    selectedTrip() {
      return this.$store.getters['is/getSelectedTrip']
    },
    generateSteps() {
      if (!this.selectedTrip.legs || this.selectedTrip.legs.length == 0) {
        return []
      }
      let result = []
      for (let i = 0; i < this.selectedTrip.legs.length - 1; i++) {
        let currentLeg = this.selectedTrip.legs[i]
        let nextLeg = this.selectedTrip.legs[i + 1]
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
      let lastLeg = this.selectedTrip.legs[this.selectedTrip.legs.length - 1]
      result.push(lastLeg)

      // Finally, we push the "FINISH" element (not from OTP)
      result.push({
        mode: 'FINISH',
        startTime: lastLeg.endTime,
        to: lastLeg.to,
      })
      return result
    },
    showSection() {
      return this.showConfirmationButton
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
    if (this.selectedTrip.state === 'SCHEDULED') {
      this.showConfirmationButton = false
    }
  },
  methods: {
    saveTrip() {
      const selectedTrip = this.$store.getters['is/getSelectedTrip']
      this.$store.dispatch('is/storeSelectedTrip', selectedTrip)
      this.$router.push('/tripPlanSubmitted')
    },
    contactDriver: function() {},
    showMap: function() {},
  },
}
</script>

<style lang="scss"></style>
