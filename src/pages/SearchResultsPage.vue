<template>
  <v-container>
    <v-layout column>
      <v-flex><h1>Reisopties</h1></v-flex>
      <v-flex mt-2>
        <v-divider />
        <v-flex v-if="getItineraries == undefined" my-4>
          Helaas, er zijn geen ritten gevonden!
        </v-flex>
        <v-expansion-panel v-if="getItineraries != undefined">
          <v-expansion-panel-content class="no-padding">
            <div slot="header">
              Reisvoorkeuren tonen
            </div>
            <v-layout>
              <v-flex>
                <v-layout column>
                  <v-flex id="personen" my-2>
                    <v-layout>
                      <v-flex>Aantal personen:</v-flex>
                      <v-flex text-xs-right pr-3>{{
                        getRidePreferences.nrOfPersons
                      }}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex id="bagage" my-2>
                    <v-layout>
                      <v-flex>Bagage:</v-flex>
                      <v-flex text-xs-right pr-3>
                        <v-icon
                          v-for="selectedLuggage in luggageTypes"
                          :key="selectedLuggage.type"
                          >{{ selectedLuggage.icon }}</v-icon
                        >
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex id="overstappen" my-2>
                    <v-layout>
                      <v-flex>Overstappen:</v-flex>
                      <v-flex
                        v-if="getRidePreferences.transferAllowed"
                        pr-3
                        text-xs-right
                      >
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
                          v-for="travelMode in getRidePreferences.allowedTravelModes"
                          :key="travelMode.mode"
                          >{{ travelMode.icon }}</v-icon
                        >
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex id="loopafstand" my-2>
                    <v-layout>
                      <v-flex>Aantal minuten lopen:</v-flex>
                      <v-flex text-xs-right pr-3>{{
                        getRidePreferences.maxMinutesWalking
                      }}</v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-divider />
        <v-layout v-if="getItineraries != undefined" align-center mt-3>
          <v-flex xs8>{{ date }}</v-flex>
          <v-flex>
            <v-layout align-center @click="changeSort()">
              <v-flex text-xs-right>
                {{ sortModi[selectedModus].name }}
              </v-flex>
              <v-flex text-xs-right shrink>
                <v-icon>unfold_more</v-icon>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-for="(itinerary, index) in getItineraries" :key="index">
        <travel-card class="mt-2" :journey="itinerary"></travel-card>
      </v-flex>
      <v-flex mt-3>
        <v-layout column>
          <v-flex>
            <v-layout pa-2>
              <v-flex xs2>
                <v-icon>fa-volume-up</v-icon>
              </v-flex>
              <v-flex>Plaats oproep in de community</v-flex>
            </v-layout>
          </v-flex>
          <v-flex mt-3 mb-3>
            <v-layout pa-2>
              <v-flex xs2>
                <v-icon>phone_in_talk</v-icon>
              </v-flex>
              <v-flex>Bel de ZOOV regiotaxi</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TravelCard from '@/components/search-results/TravelCard.vue'
import luggageTypes from '@/constants/luggage-types.js'

import moment from 'moment'

export default {
  name: 'SearchResultsPage',
  components: {
    TravelCard,
  },
  data: function() {
    return {
      sortModi: [
        { name: 'Vertrektijd', function: this.sortByStartTime },
        { name: 'Tijdsduur', function: this.sortByDuration },
        { name: 'Overstappen', function: this.sortByTransfers },
      ],
      selectedModus: 0,
    }
  },
  computed: {
    luggageTypes() {
      return luggageTypes
    },
    getItineraries() {
      return this.$store.getters['is/getItineraries']
    },
    date() {
      return 'INVALID'
    },
    getRidePreferences() {
      return this.$store.getters['ps/getUser'].ridePreferences
    },
  },
  methods: {
    sortByDuration: function(a, b) {
      return a.duration - b.duration
    },
    sortByTransfers: function(a, b) {
      return a.legs.length - b.legs.length
    },
    sortByStartTime: function(a, b) {
      return a.startTime - b.startTime
    },
    changeSort: function() {
      this.selectedModus = (this.selectedModus + 1) % this.sortModi.length
      this.$store.commit(
        'is/sortItineraries',
        this.sortModi[this.selectedModus].function
      )
    },
  },
}
</script>

<style lang="scss">
.no-padding .v-expansion-panel__header {
  padding-left: 0;
  padding-right: 0;
}
</style>
