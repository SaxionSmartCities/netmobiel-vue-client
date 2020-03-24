<template>
  <content-pane>
    <v-row v-if="selectedLegs && showMap" class="pa-0">
      <v-col class="pa-0">
        <route-map
          ref="mapComp"
          :legs="selectedLegs"
          :map-size-prop="mapSize"
          @sizeChanged="onMapSizeChanged"
        ></route-map>
      </v-col>
    </v-row>
    <v-row class="flex-column">
      <v-col class="mb-3 py-0">
        <h1>Reis details</h1>
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
      <v-col>
        <v-row class="flex-column">
          <v-col v-if="isShoutOut">
            <p>Shoutout,</p>
            <p>Shoutout,</p>
            <p>Let it all out.</p>
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
    </v-row>
    <v-row v-if="!isShoutOut && hasRideShareDriver">
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          @click="contactDriver"
        >
          Stuur bericht naar chauffeur
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!isShoutOut">
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
          Bekijk op de kaart
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-0">
      <v-col class="pb-0">
        <h3>Wijzigen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <itinerary-options></itinerary-options>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import RouteMap from '@/components/itinerary-details/RouteMap'

import travelModes from '@/constants/travel-modes.js'

export default {
  name: 'TripDetailPage',
  components: {
    RouteMap,
    ContentPane,
    ItinerarySummary,
    ItineraryLeg,
    ItineraryOptions,
  },
  data() {
    return {
      selectedLegs: null,
      selectedLegsIndex: null,
      showMap: true,
      mapSize: 'small',
    }
  },
  computed: {
    isShoutOut() {
      return this.generateSteps.length === 0
    },
    hasRideShareDriver() {
      return this.getRideShareDriver !== null
    },
    getRideShareDriver() {
      const rideshareMode = travelModes.RIDESHARE.mode
      for (let i = 0; i < this.selectedTrip.legs.length; i++) {
        if (this.selectedTrip.legs[i].traverseMode === rideshareMode) {
          return this.selectedTrip.legs[i].driverId
        }
      }
      return null
    },
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
      const selectedTrip = this.$store.getters['is/getSelectedTrip']
      this.$store
        .dispatch('is/storeSelectedTrip', selectedTrip)
        .then(() => this.$router.push('/tripPlanSubmitted'))
    },
    onLegSelected({ leg, step }) {
      this.selectedLegs = [leg]
      this.selectedLegsIndex = step
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
    showFullRouteOnMap() {
      this.mapSize = 'fullscreen'
      this.selectedLegs = this.selectedTrip.legs
      this.forceRerender()
    },
    contactDriver() {
      console.log(this.selectedTrip)
      this.$router.push({
        name: `conversation`,
        params: {
          context: this.selectedTrip.tripRef,
          participants: [
            {
              managedIdentity: this.$store.getters['ps/getProfile'].id,
              urn: '',
            },
            {
              managedIdentity: '',
              urn: this.getRideShareDriver,
            },
          ],
        },
      })
    },
  },
}
</script>

<style lang="scss"></style>
