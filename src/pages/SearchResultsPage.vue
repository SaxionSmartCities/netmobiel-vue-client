<template>
  <v-container>
    <v-layout column>
      <v-flex><h1>Reisopties</h1></v-flex>
      <v-flex my-2>
        <v-divider />
        <v-flex v-if="itineraries == undefined" my-4>
          Helaas, er zijn geen ritten gevonden!
        </v-flex>
        <v-expansion-panel v-if="itineraries != undefined">
          <v-expansion-panel-content class="no-padding">
            <div slot="header">
              Reisvoorkeuren tonen
            </div>
            <search-options-summary-card />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-divider />
        <!-- <v-layout v-if="itineraries != undefined" align-center mt-3>
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
        </v-layout> -->
      </v-flex>
      <v-layout row wrap>
        <v-flex v-if="rides.length > 0" xs12 mb-3>
          <v-flex my-2><h4>Directe ritten</h4></v-flex>
          <v-flex v-for="ride in rides" :key="ride.id" xs12>
            <direct-ride-card
              :from="OVPlanningResults.from"
              :to="OVPlanningResults.to"
              :date="OVPlanningResults.date"
              :ride="ride"
            >
            </direct-ride-card>
          </v-flex>
        </v-flex>
        <v-flex xs12>
          <v-flex my-2><h4>Ritten op basis van OV</h4></v-flex>
          <v-flex v-for="(itinerary, index) in itineraries" :key="index" xs12>
            <travel-card
              class="mt-2"
              :from="OVPlanningResults.from"
              :to="OVPlanningResults.to"
              :date="OVPlanningResults.date"
              :journey="itinerary"
            >
            </travel-card>
          </v-flex>
        </v-flex>
      </v-layout>
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
import DirectRideCard from '@/components/search-results/DirectRideCard.vue'
import moment from 'moment'

export default {
  name: 'SearchResultsPage',
  components: {
    TravelCard,
    SearchOptionsSummaryCard,
    DirectRideCard,
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
    planningResults: function() {
      return this.$store.getters['is/getPlanningResults']
    },
    OVPlanningResults: function() {
      return this.planningResults.plan
    },
    itineraries() {
      return this.OVPlanningResults.itineraries
    },
    rides() {
      return this.planningResults.rides
    },
    date() {
      return moment(this.OVPlanningResults.date).format('DD-MM-YYYY')
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
