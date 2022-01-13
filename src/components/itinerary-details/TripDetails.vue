<template>
  <v-row dense>
    <v-col>
      <v-row v-if="selectedLegs && shouldShowMap">
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
                @legSelect="onLegSelected"
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
      showMapInternal: false,
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
          if (rsLeg.confirmed !== undefined) {
            const value = rsLeg.confirmed
              ? 'Ik heb meegereden'
              : 'Ik heb niet meegereden'
            result.push({ label: 'Bevestiging', value: value })
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
      return this.showMapInternal || this.showMap
    },
    selectedLegs() {
      if (this.selectedLegsIndex != null) {
        return [this.trip.itinerary.legs[this.selectedLegsIndex]]
      } else {
        return this.trip?.itinerary?.legs
      }
    },
  },
  methods: {
    onMapSizeChanged({ size }) {
      this.mapSize = size
    },
    onMapClose() {
      this.showMapInternal = false
      this.selectedLegsIndex = null
      this.mapSize = 'small'
      this.$emit('closeMap')
    },
    onLegSelected({ step }) {
      if (this.selectedLegsIndex === step && this.showMapInternal) {
        this.onMapClose()
      } else {
        // this.selectedLegs = [leg]
        this.selectedLegsIndex = step
        this.forceRerender()
      }
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.showMapInternal = false
      this.$nextTick(() => {
        // Add the component back in
        this.showMapInternal = true
      })
    },
  },
}
</script>

<style scoped></style>
