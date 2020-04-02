<template>
  <content-pane>
    <div class="d-flex flex-column grow px-4 py-3">
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
      <v-row class="flex-column">
        <v-col class="pa-0">
          <h3 class="mb-3">Reisdetails</h3>
          <v-divider />
        </v-col>
        <v-col class="py-0 px-3">
          <itinerary-summary
            :date="selectedTrip.departureTime"
            :cost="5"
            :duration="selectedTrip.duration"
          >
          </itinerary-summary>
        </v-col>
        <v-col class="pa-0">
          <v-divider />
        </v-col>
        <v-col class="px-0">
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
    </div>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import RouteMap from '@/components/itinerary-details/RouteMap'

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
