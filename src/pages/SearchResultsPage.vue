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
            <search-options-summary-card />
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
        <travel-card
          class="mt-2"
          :from="getPlanningResult.from"
          :to="getPlanningResult.to"
          :date="getPlanningResult.date"
          :journey="itinerary"
        >
        </travel-card>
      </v-flex>
      <v-flex mt-3>
        <v-layout column>
          <v-flex>
            <!-- <v-layout pa-2>
              <v-flex xs2>
                <v-icon>fa-volume-up</v-icon>
              </v-flex>
              <v-flex>Plaats oproep in de community</v-flex>
            </v-layout> -->
          </v-flex>
          <v-flex mt-3 mb-3>
            <a href="tel:0900-9874">
              <v-layout pa-2>
                <v-flex xs2>
                  <v-icon>phone_in_talk</v-icon>
                </v-flex>
                <v-flex>Bel de ZOOV regiotaxi</v-flex>
              </v-layout>
            </a>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TravelCard from '@/components/search-results/TravelCard.vue'
import SearchOptionsSummaryCard from '@/components/search-results/SearchOptionsSummaryCard.vue'

export default {
  name: 'SearchResultsPage',
  components: {
    TravelCard,
    SearchOptionsSummaryCard,
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
    getPlanningResult() {
      return this.$store.getters['is/getPlanningResult']
    },
    getItineraries() {
      return this.getPlanningResult.itineraries
    },
    date() {
      return ''
      // return 'INVALID'
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

a {
  text-decoration: none;
  color: #2e8997;
}
</style>
