<template>
  <v-container class="body-2">
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
    <v-row dense>
      <v-col>Overstappen </v-col>
      <v-col class="text-right">
        <v-icon v-if="getSearchPreferences.allowTransfer">check</v-icon>
        <v-icon v-else color="red">close</v-icon>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>Toegestaan </v-col>
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
      <v-col>Max. looptijd</v-col>
      <v-col class="text-right">
        {{ getSearchPreferences.maximumTransferTime }} minuten
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import luggageTypes from '@/constants/luggage-types.js'
import travelModes from '@/constants/travel-modes.js'

export default {
  name: 'SearchOptionsSummaryCard',

  data: function() {
    return {}
  },
  computed: {
    getSearchPreferences() {
      return this.$store.getters['ps/getProfile'].searchPreferences
    },
    luggageOptions() {
      return this.getSearchPreferences.luggageOptions.map(x => luggageTypes[x])
    },
    allowedTravelModes() {
      return this.getSearchPreferences.allowedTravelModes.map(
        x => travelModes[x]
      )
    },
  },
}
</script>

<style lang="scss"></style>
