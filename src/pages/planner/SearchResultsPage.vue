<template>
  <content-pane>
    <v-row dense class="d-flex flex-column">
      <v-col><h1>Reisopties</h1></v-col>
      <v-col my-2>
        <v-col v-if="plan.itineraries == undefined" my-4>
          Helaas, er zijn geen ritten gevonden!
        </v-col>
        <v-col class="px-0 pb-0" v-else>
          <v-divider />
          <v-row>
            <v-col class="py-0">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    Reisvoorkeuren tonen
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <search-options-summary-card />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-divider />
          <v-row justify="end">
            <v-col class="shrink pb-0 mt-2">
              <v-btn
                @click="toggleSelectedSortModus()"
                color="primary"
                rounded
                outlined
              >
                {{ selectedSortModus.title }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
      <v-col v-for="(itinerary, index) in sortedItineraries()" :key="index">
        <travel-card
          :index="index"
          :from="plan.from"
          :to="plan.to"
          :arrival-time="toDate(itinerary.arrivalTime)"
          :departure-time="toDate(itinerary.departureTime)"
          :duration="itinerary.duration"
          :legs="itinerary.legs"
          @onTripSelected="onTripSelected"
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
      selectedSortModusIndex: 0,
      sortModi: [
        { title: 'Snelste', value: 'fastest' },
        { title: 'Chronologisch', value: 'chronologically' },
      ],
    }
  },
  computed: {
    selectedSortModus() {
      return this.sortModi[this.selectedSortModusIndex]
    },
    plan() {
      return this.$store.getters['is/getPlanningResults'].plan
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    sortedItineraries() {
      const list = Object.assign([], this.plan.itineraries)

      console.log(list)
      if (this.selectedSortModus.value === 'fastest') {
        list.sort((a, b) => {
          return new Date(a.duration) - new Date(b.duration)
        })
      } else {
        list.sort((a, b) => {
          return new Date(a.departureTime) - new Date(b.departureTime)
        })
      }
      return list
    },
    onTripSelected(index) {
      let selectedTrip = {
        from: this.plan.from,
        to: this.plan.to,
        ...this.plan.itineraries[index],
      }
      this.$store.commit('is/setSelectedTrip', selectedTrip)
      this.$router.push('/itineraryDetailPage')
    },
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
    toggleSelectedSortModus() {
      this.selectedSortModusIndex =
        (this.selectedSortModusIndex + 1) % this.sortModi.length
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