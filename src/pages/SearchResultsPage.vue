<template>
  <content-pane>
    <v-row class="d-flex flex-column">
      <v-col><h1>Reisopties</h1></v-col>
      <v-col class="my-2">
        <v-divider />
        <v-col class="my-2" v-if="plan.itineraries == undefined">
          Helaas, er zijn geen ritten gevonden!
        </v-col>
        <v-expansion-panels v-else>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Reisvoorkeuren tonen
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <search-options-summary-card />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider />
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <div v-for="(itinerary, index) in plan.itineraries" :key="index">
              <travel-card
                class="mt-2"
                :from="plan.from"
                :to="plan.to"
                :date="toDate(plan.arrivalTime)"
                :journey="itinerary"
              >
              </travel-card>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="mt-3">
        <v-row class="d-flex flex-column">
          <v-col mt-3 mb-3>
            <a href="tel:0900-9874">
              <v-layout pa-2>
                <v-flex xs2>
                  <v-icon>phone_in_talk</v-icon>
                </v-flex>
                <v-flex>Bel de ZOOV regiotaxi</v-flex>
              </v-layout>
            </a>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/search-results/TravelCard.vue'
import SearchOptionsSummaryCard from '@/components/search-results/SearchOptionsSummaryCard.vue'
import moment from 'moment'

export default {
  name: 'SearchResultsPage',
  components: {
    ContentPane,
    TravelCard,
    SearchOptionsSummaryCard,
  },
  data() {
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
    plan() {
      return this.$store.getters['is/getPlanningResults'].plan
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    toDate(string) {
      return moment(string)
    },
    sortByDuration(a, b) {
      return a.duration - b.duration
    },
    sortByTransfers(a, b) {
      return a.legs.length - b.legs.length
    },
    sortByStartTime(a, b) {
      return a.startTime - b.startTime
    },
    changeSort() {
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
