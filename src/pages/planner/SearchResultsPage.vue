<template>
  <content-pane>
    <template v-slot:header>
      <v-row class="d-flex flex-column search-header px-3">
        <v-col class="py-0">
          <search-criteria
            v-model="searchCriteria"
            @locationFieldSelected="onLocationFieldSelected"
            @criteriaChanged="onCriteriaChanged"
          />
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
        <v-col class="py-0">
          <v-divider />
          <div
            v-if="localTripId !== -1 && tripId"
            class="px-4 py-2 d-flex flex-row align-center edit-container"
          >
            <v-icon small color="button">warning</v-icon>
            <span class="caption ml-3 secondary-color">
              LET OP! U bent aan het wijzigen.</span
            >
          </div>
        </v-col>
      </v-row>
    </template>
    <v-row dense class="d-flex flex-column">
      <v-col v-if="planningStatus.status === 'PENDING'">
        <search-status />
      </v-col>
      <v-col v-else>
        <v-row justify="space-between">
          <v-col v-if="planResult.itineraries.length == 0" my-4>
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
                <a href="#" @click="createShoutOut()">
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
import * as uiStore from '@/store/ui'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'SearchResultsPage',
  components: {
    SearchOptionsSummaryCard,
    SearchCriteria,
    SearchStatus,
    ContentPane,
    TravelCard,
  },
  props: {
    tripId: {
      type: String,
      required: true,
    },
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
    searchCriteria() {
      return isStore.getters.getSearchCriteria
    },
    planningStatus() {
      return isStore.getters.getPlanningStatus
    },
    planRequest() {
      return isStore.getters.getPlanningRequest
    },
    planResult() {
      return isStore.getters.getPlanningResults
    },
    searchPreferences() {
      return this.planRequest.preferences
    },
    selectedSortModus() {
      return this.sortModi[this.selectedSortModusIndex]
    },
    localTripId() {
      return Number.parseInt(this.tripId)
    },
  },
  watch: {
    planningStatus(newValue) {
      if (newValue.status === 'SUCCESS') {
        isStore.mutations.clearPlanningRequest()
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    onLocationFieldSelected(newField) {
      this.$router.push({
        name: 'searchLocation',
        params: { field: newField.field, editSearchCriteria: true.toString() },
      })
    },
    onCriteriaChanged(newCriteria) {
      //TODO: Do the valid time check in the search criteria component.
      // If the selected date is in the past show an error.
      if (moment(newCriteria?.travelTime?.when) < moment()) {
        uiStore.actions.queueNotification(
          {
            message: 'De geselecteerde tijd ligt in het verleden.',
            timeout: 0,
          },
          { root: true }
        )
      }
      isStore.mutations.setSearchCriteria(newCriteria)
      //HACK: preferences here are different from the profile.
      const { from, to, travelTime } = this.searchCriteria
      isStore.actions.submitPlanningsRequest({
        from,
        to,
        travelTime,
        preferences: this.searchPreferences,
      })
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
      isStore.mutations.setSelectedTrip(selectedTrip)
      this.$router.push('/itineraryDetailPage')
    },
    createShoutOut() {
      isStore.actions.storeShoutOut(this.searchCriteria)
    },
    toDate(string) {
      return moment(string)
    },
    //TODO: Add sorting again.
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
  background-color: $background-light-green;
}

.edit-container {
  background-color: rgba($color-orange, 0.15);
}
</style>
