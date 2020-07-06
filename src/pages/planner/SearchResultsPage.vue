<template>
  <content-pane>
    <template v-slot:header>
      <v-row class="d-flex flex-column search-header px-3">
        <v-col class="py-0">
          <search-criteria />
        </v-col>
        <v-col class="py-0">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header class="search-header pl-0">
                Reisvoorkeuren tonen
              </v-expansion-panel-header>
              <v-expansion-panel-content class="search-header">
                <search-options-summary-card :preferences="searchPreferences" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0"><v-divider /></v-col>
      </v-row>
    </template>
    <v-row dense class="d-flex flex-column">
      <v-col v-if="planningStatus.status === 'PENDING'">
        <search-status />
      </v-col>
      <v-col v-else>
        <v-row justify="space-between">
          <v-col v-if="planResult.itineraries == undefined" my-4>
            Helaas, er zijn geen ritten gevonden!
          </v-col>
          <v-col v-else>
            <section
              v-for="(date, index) in getAllDifferentDays(sortedItineraries())"
              :key="index"
              class="px-0"
            >
              <h4 class="netmobiel py-1">{{ formatToCategoryDate(date) }}</h4>
              <v-col
                v-for="(itinerary, indx) in getItinerariesForThatDay(
                  sortedItineraries(),
                  date
                )"
                :key="indx"
                class="px-0 py-1"
              >
                <travel-card
                  :index="indx"
                  :from="planResult.from"
                  :to="planResult.to"
                  :arrival-time="toDate(itinerary.arrivalTime)"
                  :departure-time="toDate(itinerary.departureTime)"
                  :duration="itinerary.duration"
                  :legs="itinerary.legs"
                  @onTripSelected="onTripSelected"
                >
                </travel-card>
              </v-col>
            </section>
          </v-col>
        </v-row>
        <v-row>
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
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/search-results/TravelCard.vue'
import SearchOptionsSummaryCard from '@/components/search-results/SearchOptionsSummaryCard.vue'
import SearchCriteria from '@/components/common/SearchCriteria.vue'
import SearchStatus from '@/components/search/SearchStatus.vue'
import moment from 'moment'

export default {
  name: 'SearchResultsPage',
  components: {
    SearchOptionsSummaryCard,
    SearchCriteria,
    SearchStatus,
    ContentPane,
    TravelCard,
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
    planningRequest() {
      console.log('computed plannign request')
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      const { when, arriving } = this.$store.getters['gs/getPreFilledTime']
      const result = {
        from: { label: from.title },
        to: { label: to.title },
        isArrival: arriving,
      }

      if (arriving) result['arrivalTime'] = when
      else result['departureTime'] = when

      return result
    },
    planningStatus() {
      return this.$store.getters['is/getPlanningStatus']
    },
    selectedSortModus() {
      return this.sortModi[this.selectedSortModusIndex]
    },
    planRequest() {
      return this.$store.getters['is/getPlanningRequest']
    },
    planningResponse() {
      return this.$store.getters['is/getPlanningStatus']
    },
    planResult() {
      return this.$store.getters['is/getPlanningResults'].plan
    },
    searchPreferences() {
      return this.planRequest.preferences
    },
  },
  watch: {
    planningRequest(newValue) {
      console.log('IN THE WATCHER', newValue)
    },
    planningResponse(newValue) {
      if (newValue.status === 'SUCCESS') {
        this.$store.commit('is/clearPlanningRequest')
      }
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    search() {
      // this.$store.dispatch('is/submitPlanningsRequest', {
      //   from: result.from,
      //   to: result.to,
      //   searchPreferences,
      //   timestamp: journeyMoment,
      // })
    },
    getAllDifferentDays(itineraries) {
      let differentDays = []
      itineraries.forEach(it => {
        const calendarDate = moment(it.arrivalTime).format('LL')
        if (!differentDays.includes(calendarDate)) {
          differentDays.push(calendarDate)
        }
      })
      return differentDays
    },
    getItinerariesForThatDay(itineraries, sectionDay) {
      return itineraries.filter(it => {
        const dateToCheck = moment(it.arrivalTime.valueOf())
        return (
          moment(sectionDay, 'LL').isSame(dateToCheck, 'day') &&
          moment(sectionDay, 'LL').isSame(dateToCheck, 'month')
        )
      })
    },
    onChangePlanProperty(value) {
      console.log('onChangePlanProperty ', value)
      if (value === 'from' || value === 'to')
        this.$router.push({ name: 'searchLocation', params: { field: value } })
    },
    formatToCategoryDate(date) {
      return moment(date, 'LL')
        .locale('NL')
        .format('dddd DD MMMM')
    },
    sortedItineraries() {
      const list = Object.assign([], this.planResult.itineraries)
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
        from: this.planResult.from,
        to: this.planResult.to,
        nrSeats: this.planResult.nrSeats,
        itinerary: this.planResult.itineraries[index],
        itineraryRef: this.planResult.itineraries[index].itineraryRef,
      }
      this.$store.commit('is/setSelectedTrip', selectedTrip)
      this.$router.push('/itineraryDetailPage')
    },
    shoutOut() {
      const shoutOutTrip = {
        from: this.planResult.from,
        to: this.planResult.to,
        timestamp: this.planRequest.timestamp,
        preferences: this.planRequest.preferences,
      }
      this.$store.dispatch('is/storeShoutOut', shoutOutTrip)
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

.date-day-styling {
  color: $color-primary;
}

a {
  text-decoration: none;
  color: #2e8997;
  span {
    font-size: 1em;
  }
}

.search-header {
  background-color: rgba(46, 137, 151, 0.1);
}
</style>
