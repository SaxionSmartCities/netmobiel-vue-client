<template>
  <v-row class="body-2" no-gutters>
    <v-col>
      <v-row dense>
        <v-col>Aantal personen</v-col>
        <v-col class="text-right">
          {{ getSearchPreferences.numPassengers }}</v-col
        >
      </v-row>
      <v-row dense>
        <v-col>Bagage </v-col>
        <v-col class="text-right">
          <v-icon
            v-for="selectedLuggage in luggageOptions"
            :key="selectedLuggage.label"
          >
            {{ selectedLuggage.icon }}
          </v-icon>
        </v-col>
      </v-row>
      <v-row v-if="isRideshareAllowed" dense>
        <v-col>Overstappen van auto </v-col>
        <v-col class="text-right">
          <v-icon v-if="getSearchPreferences.allowFirstLegRideshare"
            >check</v-icon
          >
          <v-icon v-else color="red">close</v-icon>
        </v-col>
      </v-row>
      <v-row v-if="isRideshareAllowed" dense>
        <v-col>Overstappen naar auto </v-col>
        <v-col class="text-right">
          <v-icon v-if="getSearchPreferences.allowLastLegRideshare"
            >check</v-icon
          >
          <v-icon v-else color="red">close</v-icon>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>Vervoermiddelen </v-col>
        <v-col class="text-right">
          <v-icon
            v-for="travelMode in allowedTravelModes"
            :key="travelMode.label"
          >
            {{ travelMode.icon }}
          </v-icon>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>Max. loopafstand</v-col>
        <v-col class="text-right">
          {{ getSearchPreferences.maxWalkDistance }} meter
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import luggageTypes from '@/constants/luggage-types.js'
import travelModes from '@/constants/travel-modes.js'
import * as psStore from '@/store/profile-service'

export default {
  name: 'SearchOptionsSummaryCard',
  computed: {
    getSearchPreferences() {
      return psStore.getters.getProfile.searchPreferences
    },
    isRideshareAllowed() {
      return this.getSearchPreferences?.allowedTravelModes.includes('RIDESHARE')
    },
    luggageOptions() {
      return this.getSearchPreferences.luggageOptions.map(
        (x) => luggageTypes[x]
      )
    },
    allowedTravelModes() {
      return this.getSearchPreferences.allowedTravelModes.map(
        (x) => travelModes[x]
      )
    },
  },
}
</script>

<style lang="scss"></style>
