<template>
  <content-pane>
    <v-row v-if="selectedLegs && showMap" class="pa-0">
      <v-col class="pa-0">
        <route-map
          ref="mapComp"
          :legs="selectedLegs"
          :map-size-prop="mapSize"
          @sizeChanged="onMapSizeChanged"
          @closeMap="showMap = false"
        >
        </route-map>
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
          :date="selectedTrip.itinerary.departureTime"
          :cost="5"
          :duration="selectedTrip.itinerary.duration"
        >
        </itinerary-summary>
      </v-col>
      <v-col>
        <v-divider />
      </v-col>
      <v-col class="px-6">
        <v-row class="flex-column">
          <v-col v-if="generateSteps.length === 0">
            Shoutout
          </v-col>
          <v-col
            v-for="(leg, index) in generateSteps"
            v-else
            :key="index"
            class="py-0"
          >
            <itinerary-leg
              :is-map-active="selectedLegsIndex === index"
              :step="index"
              :leg="leg"
              @legSelect="onLegSelected"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col>
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
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          @click="showFullRouteOnMap()"
        >
          bekijk op de kaart
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import RouteMap from '@/components/itinerary-details/RouteMap.vue'

import { generateItineraryDetailSteps } from '@/utils/itinerary_steps.js'

export default {
  name: 'ItineraryDetailPage',
  components: {
    RouteMap,
    ContentPane,
    ItinerarySummary,
    ItineraryLeg,
  },
  data() {
    return {
      selectedLegs: null,
      selectedLegsIndex: null,
      showMap: true,
      mapSize: 'small',
      showConfirmationButton: true,
    }
  },
  computed: {
    selectedTrip() {
      return this.$store.getters['is/getSelectedTrip']
    },
    generateSteps() {
      return generateItineraryDetailSteps(this.selectedTrip.itinerary)
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
    onMapSizeChanged({ size }) {
      this.mapSize = size
    },
    saveTrip() {
      this.$store
        .dispatch('is/storeSelectedTrip', this.selectedTrip)
        .then(() => this.$router.push('/tripPlanSubmitted'))
    },
    onLegSelected({ leg, step }) {
      if (this.selectedLegsIndex === step && this.showMap) {
        this.showMap = false
        this.selectedLegsIndex = null
      } else {
        this.selectedLegs = [leg]
        this.selectedLegsIndex = step
        this.forceRerender()
      }
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.showMap = false
      this.$nextTick(() => {
        // Add the component back in
        this.showMap = true
      })
    },
    showFullRouteOnMap() {
      this.mapSize = 'fullscreen'
      this.selectedLegs = this.selectedTrip.legs
      this.forceRerender()
    },
  },
}
</script>

<style lang="scss"></style>
