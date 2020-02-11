<template>
  <content-pane>
    <v-row class="d-flex flex-column">
      <v-col><h1>Reisopties</h1></v-col>
      <v-col my-2>
        <v-divider />
        <v-col v-if="plan.itineraries == undefined" my-4>
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
      <v-col v-for="(itinerary, index) in plan.itineraries" :key="index">
        <travel-card
          :from="plan.from"
          :to="plan.to"
          :arrivalTime="toDate(itinerary.arrivalTime)"
          :departureTime="toDate(itinerary.departureTime)"
          :duration="itinerary.duration"
          :legs="itinerary.legs"
        >
        </travel-card>
      </v-col>
      <v-col mt-3>
        <v-row class="flex-column">
          <v-col class="py-0">
            <a href="#" @click="shoutOut()">
              <v-row>
                <v-col class="col-2 ml-2">
                  <v-icon>fa-volume-up</v-icon>
                </v-col>
                <v-col>
                  <span>Plaats oproep in de community</span>
                </v-col>
              </v-row>
            </a>
          </v-col>
          <v-col class="py-0">
            <a href="tel:0900-9874">
              <v-row>
                <v-col class="col-2 ml-2">
                  <v-icon>phone_in_talk</v-icon>
                </v-col>
                <v-col>
                  <span>Bel de ZOOV regiotaxi</span>
                </v-col>
              </v-row>
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
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    shoutOut() {
      const shoutOutTrip = {
        from: this.plan.from,
        to: this.plan.to,
        arrivalTime: this.plan.arrivalTime
          ? this.plan.arrivalTime
          : `${moment(this.plan.departureTime)
              .startOf('day')
              .format('YYYY-MM-DDTHH:mm:ss')}Z`,
        departureTime: this.plan.departureTime
          ? this.plan.departureTime
          : `${moment(this.plan.arrivalTime)
              .add(1, 'day')
              .startOf('day')
              .format('YYYY-MM-DDTHH:mm:ss')}Z`,
      }
      this.$store.dispatch('is/storeSelectedTrip', shoutOutTrip)
    },
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
  span {
    font-size: 1em;
  }
}
</style>
