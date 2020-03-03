<template>
  <content-pane>
    <v-row v-if="selectedLeg && showMap">
      <v-col>
        <route-map :leg="selectedLeg"></route-map>
      </v-col>
    </v-row>
    <v-row class=" flex-column">
      <v-col class="mb-3 py-0">
        <h1>Reisdetails</h1>
      </v-col>
      <v-col class="py-0">
        <v-divider />
      </v-col>
      <v-col class="py-0">
        <itinerary-summary
          :date="selectedTrip.departureTime"
          :cost="5"
          :duration="selectedTrip.duration"
        >
        </itinerary-summary>
      </v-col>
      <v-col>
        <v-divider />
      </v-col>
      <v-col class="mx-3">
        <v-row class="flex-column">
          <v-col v-if="generateSteps.length == 0">
            Shoutout
          </v-col>
          <v-col
            class="py-0"
            v-for="(leg, index) in generateSteps"
            v-else
            :key="index"
          >
            <itinerary-leg
              :isMapActive="selectedLegIndex === index"
              :step="index"
              @legSelect="onLegSelected"
              :leg="leg"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col class="my-4">
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
      </v-col>
    </v-row>
      </v-flex>
      <v-flex my-4>
        <v-btn
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
      </v-flex>
      <v-flex my-4>
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
          bekijk op de kaart
        </v-btn>
      </v-flex>
      <v-flex mb-3>
        <h1>Wijzigen</h1>
      </v-flex>
      <itinerary-options></itinerary-options>
    </v-layout>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import RouteMap from '@/components/itinerary-details/RouteMap'

export default {
  name: 'ItineraryDetailPage',
  components: { RouteMap, ContentPane, ItinerarySummary, ItineraryLeg, ItineraryOptions },
  data() {
    return {
      selectedLeg: null,
      selectedLegIndex: null,
      showMap: true,
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
    },
    onLegSelected({ leg, step }) {
      this.selectedLeg = leg
      this.selectedLegIndex = step
      this.forceRerender()
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.showMap = false
      this.$nextTick(() => {
        // Add the component back in
        this.showMap = true
      })
    },
    contactDriver: function() {},
    showMap: function() {},
  },
}
</script>

<style lang="scss"></style>
