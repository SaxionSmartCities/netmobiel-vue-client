<template>
  <v-row dense>
    <v-col>
      <v-row v-if="selectedLegs && selectedLegs.length > 0 && shouldShowMap">
        <v-col>
          <route-map
            ref="mapComp"
            :legs="selectedLegs"
            :map-size-prop="mapSize"
            @sizeChanged="onMapSizeChanged"
            @closeMap="onMapClose"
          >
          </route-map>
        </v-col>
      </v-row>
      <v-row dense class="d-flex flex-column">
        <v-col><h1>Ritdetails</h1></v-col>
        <v-col><v-divider /></v-col>
        <v-col>
          <itinerary-summary-list :items="items" />
        </v-col>
        <v-col><v-divider /></v-col>
        <v-col>
          <v-row class="flex-column">
            <v-col>
              <itinerary-leg
                v-for="(leg, index) in generateSteps"
                :key="index"
                :is-map-active="selectedLegsIndex === index"
                :step="index"
                :leg="leg"
                @leg-select="onLegSelected"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import RouteMap from '@/components/itinerary-details/RouteMap.vue'
import { generateItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import { formatDateTimeLongNoYear } from '@/utils/datetime.js'
import constants from '@/constants/constants'
import { triStateLogicText } from '@/utils/Utils'

export default {
  name: 'TripDetails',
  components: {
    RouteMap,
    ItinerarySummaryList,
    ItineraryLeg,
  },
  props: {
    trip: { type: Object, required: true },
    showMap: { type: Boolean, default: false },
  },
  data() {
    return {
      selectedLegsIndex: null,
      showMapMasterSwitch: true,
      mapSize: 'small',
    }
  },
  computed: {
    items() {
      let result = []
      if (this.trip.itinerary) {
        const { departureTime, duration, legs } = this.trip.itinerary
        result.push({
          label: 'Datum',
          value: formatDateTimeLongNoYear(departureTime),
        })
        if (duration) {
          const reisduur = `${Math.round(duration / 60)} minuten`
          result.push({ label: 'Reisduur', value: reisduur })
        }
        let rsLeg = legs.find((lg) => lg.traverseMode === 'RIDESHARE')
        if (rsLeg) {
          result.push({
            label: 'Kosten',
            value: `${rsLeg.fareInCredits} credits`,
          })
          if (rsLeg.state === 'VALIDATING' || rsLeg.state === 'COMPLETED') {
            const cv = this.confirmationText(rsLeg.confirmed)
            result.push({ label: 'Meegereden', value: cv })
            if (rsLeg.confirmed === false) {
              const reason = this.passengerReasonText(rsLeg.confirmationReason)
              result.push({ label: 'Reden', value: reason })
            }
          }
          result.push({
            label: 'Betaling',
            value: constants.PAYMENT_STATE[rsLeg.paymentState],
          })
        }
      }
      return result
    },
    generateSteps() {
      return generateItineraryDetailSteps(this.trip.itinerary)
    },
    shouldShowMap() {
      return this.showMapMasterSwitch && (this.showLegInMap || this.showMap)
    },
    showLegInMap() {
      return this.selectedLegsIndex !== null
    },
    selectedLegs() {
      if (this.selectedLegsIndex !== null) {
        return [this.trip.itinerary.legs[this.selectedLegsIndex]]
      } else {
        return this.trip?.itinerary?.legs
      }
    },
  },
  watch: {
    // If the user presses the show map button, then show the full itinerary
    showMap(newValue) {
      if (newValue && this.showLegInMap) {
        this.selectedLegsIndex = null
        this.forceRerender()
      }
    },
  },
  methods: {
    confirmationText(value) {
      return triStateLogicText(value)
    },
    passengerReasonText(reasonCode) {
      return constants.PASSENGER_TRIP_NOT_MADE_REASONS.find(
        (r) => r.value === reasonCode
      )?.title
    },
    onMapSizeChanged({ size }) {
      this.mapSize = size
    },
    onMapClose() {
      this.selectedLegsIndex = null
      this.mapSize = 'small'
      this.$emit('closeMap')
    },
    onLegSelected({ step }) {
      if (this.selectedLegsIndex === step) {
        // Keep map as is
      } else {
        this.selectedLegsIndex = step
        // Reset the flag ordering the display of the full route
        this.$emit('closeMap')
        this.forceRerender()
      }
    },
    forceRerender() {
      // Has the map a reload method? For now remove from DOM and add again
      this.showMapMasterSwitch = false
      this.$nextTick(() => {
        // Add the component back in
        this.showMapMasterSwitch = true
      })
    },
  },
}
</script>

<style scoped></style>
