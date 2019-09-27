<template>
  <v-layout>
    <v-flex>
      <v-layout column>
        <v-flex id="personen" my-2>
          <v-layout>
            <v-flex>Aantal personen:</v-flex>
            <v-flex text-xs-right pr-3>{{
              getRidePreferences.numPassengers
            }}</v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="bagage" my-2>
          <v-layout>
            <v-flex>Bagage:</v-flex>
            <v-flex text-xs-right pr-3>
              <v-icon
                v-for="selectedLuggage in luggageOptions"
                :key="selectedLuggage.label"
              >
                {{ selectedLuggage.icon }}
              </v-icon>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="overstappen" my-2>
          <v-layout>
            <v-flex>Overstappen:</v-flex>
            <v-flex v-if="getRidePreferences.allowTransfer" pr-3 text-xs-right>
              <v-icon>check</v-icon>
            </v-flex>
            <v-flex v-else pr-3 text-xs-right>
              <v-icon color="red">close</v-icon>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="toestaan" my-2>
          <v-layout>
            <v-flex>Toegestaan:</v-flex>
            <v-flex pr-3 text-xs-right>
              <v-icon
                v-for="travelMode in allowedTravelModes"
                :key="travelMode.label"
              >
                {{ travelMode.icon }}
              </v-icon>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="loopafstand" my-2>
          <v-layout>
            <v-flex>Aantal minuten lopen:</v-flex>
            <v-flex text-xs-right pr-3>
              {{ getRidePreferences.maximumTransferTime }}
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import luggageTypes from '@/constants/luggage-types-new.js'
import travelModes from '@/constants/travel-modes-new.js'

export default {
  name: 'SearchOptionsSummaryCard',

  data: function() {
    return {}
  },
  computed: {
    getRidePreferences() {
      return this.$store.getters['ps/getProfile'].ridePreferences
    },
    luggageOptions() {
      return this.getRidePreferences.luggageOptions.map(x => luggageTypes[x])
    },
    allowedTravelModes() {
      return this.getRidePreferences.allowedTravelModes.map(x => travelModes[x])
    },
  },
}
</script>

<style lang="scss"></style>
