<template>
  <content-pane scrollable>
    <template #header>
      <v-row class="shrink">
        <v-col>
          <v-divider />
          <div
            v-if="localTripId !== -1 && tripId"
            class="d-flex flex-row justify-center edit-container"
          >
            <v-icon small color="button">warning</v-icon>
            <span class="secondary-color">
              Let op! Je bent aan het wijzigen.</span
            >
          </div>
        </v-col>
      </v-row>
    </template>
    <v-row dense class="d-flex flex-column search-header">
      <v-col>
        <search-criteria
          v-model="searchCriteria"
          @locationFieldSelected="onLocationFieldSelected"
          @criteriaChanged="onCriteriaChanged"
        />
      </v-col>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header class="search-header pl-0">
              Ritvoorkeuren tonen
            </v-expansion-panel-header>
            <v-expansion-panel-content class="search-header">
              <search-options-summary-card :preferences="searchPreferences" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row dense class="d-flex flex-column">
      <v-col v-if="planningStatus.status === 'PENDING'">
        <search-status />
      </v-col>
      <v-col v-else>
        <v-row justify="space-between">
          <v-col v-if="sortedItineraries.length === 0" class="mt-4 text-center">
            Helaas, er zijn geen ritten gevonden.
          </v-col>
          <v-col v-else>
            <section
              v-for="(date, index) in getAllDifferentDays"
              :key="index"
              class="px-0"
            >
              <h4 class="netmobiel py-1">{{ formatToCategoryDate(date) }}</h4>
              <v-col
                v-for="(itinerary, indx) in getItinerariesForThatDay(date)"
                :key="indx"
                class="px-0 py-1"
              >
                <travel-card
                  :itinerary="itinerary"
                  @on-trip-selected="onTripSelected"
                >
                </travel-card>
              </v-col>
            </section>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row dense class="flex-column">
              <v-col>
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
              <v-col>
                <a @click.stop="showZoovDialog = true">
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
    <v-dialog v-model="showZoovDialog" scrollable>
      <v-card class="py-1 px-3">
        <v-card-title class="headline background-primary text-white"
          >ZOOV Regio-taxi</v-card-title
        >
        <v-card-text>
          <p>
            Heb je geen match gevonden in de app en werkte de oproep ook niet?
            Dan kun je een rit met fikse korting regelen met ZOOV (het regionale
            vervoerssysteem).
          </p>
          <p>
            Je belt zelf met ZOOV. Om de korting te krijgen zeg je dat je met
            Netmobiel reist. Jij betaalt dan automatisch de gebruikelijke 1
            credit per kilometer. Binnen een paar weken worden de credits van je
            tegoed afgehaald.
          </p>
          <p>
            Voor het reserveren van je rit bel je ZOOV Op Maat via
            <strong>0900-9874</strong>
            (€0,10 per minuut). ZOOV Op Maat is bereikbaar van 6.00 uur 's
            ochtends tot 1.00 uur ’s nachts.
          </p>
          <p>
            Vergeet niet te zeggen dat je met Netmobiel reist als je belt met
            ZOOV Op Maat!
          </p>
          <p>
            Tot slot: Gebruik deze optie alleen als je geen andere geschikte
            reisoptie aangeboden krijgt.
          </p>
        </v-card-text>
        <v-card-actions class="justify-space-around">
          <v-btn
            large
            rounded
            outlined
            depressed
            color="primary"
            min-width="9em"
            @click="showZoovDialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TravelCard from '@/components/cards/TravelCard.vue'
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
      showZoovDialog: false,
      selectedSortModusIndex: 0,
      sortModi: [
        { title: 'Relevantie', value: 'score' },
        { title: 'Snelste', value: 'fastest' },
        { title: 'Vertrektijd', value: 'departure' },
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
    tripPlan() {
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
    sortedItineraries() {
      const list = Object.assign([], this.tripPlan?.itineraries)
      if (this.selectedSortModus.value === 'score') {
        // Lower score is worse performance
        list.sort((a, b) => -(a.score - b.score))
      } else if (this.selectedSortModus.value === 'fastest') {
        list.sort((a, b) => a.duration - b.duration)
      } else if (this.selectedSortModus.value === 'departure') {
        list.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      }
      return list
    },
    getAllDifferentDays() {
      let differentDays = []
      this.sortedItineraries.forEach((it) => {
        const calendarDate = moment(it.arrivalTime).format('LL')
        if (!differentDays.includes(calendarDate)) {
          differentDays.push(calendarDate)
        }
      })
      return differentDays
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
        uiStore.actions.queueErrorNotification(
          'De geselecteerde tijd ligt in het verleden.'
        )
      }
      isStore.mutations.setSearchCriteria(newCriteria)
      //HACK: preferences here are different from the profile.
      const { from, to, travelTime } = this.searchCriteria
      isStore.actions.searchTripPlan({
        from,
        to,
        travelTime,
        preferences: this.searchPreferences,
      })
    },
    getItinerariesForThatDay(sectionDay) {
      return this.sortedItineraries.filter((it) => {
        const dateToCheck = moment(it.arrivalTime.valueOf())
        return (
          moment(sectionDay, 'LL').isSame(dateToCheck, 'day') &&
          moment(sectionDay, 'LL').isSame(dateToCheck, 'month')
        )
      })
    },
    formatToCategoryDate(date) {
      return moment(date, 'LL').locale('NL').format('dddd DD MMMM')
    },
    onTripSelected(selectedTravelCard) {
      let selectedTrip = {
        from: this.tripPlan.from,
        to: this.tripPlan.to,
        nrSeats: this.tripPlan.nrSeats,
        itineraryRef: selectedTravelCard.itinerary.itineraryRef,
        itinerary: selectedTravelCard.itinerary,
      }
      isStore.mutations.setSelectedTrip(selectedTrip)
      this.$router.push({
        name: 'itineraryDetailPage',
        params: { tripId: String(this.tripId) },
      })
    },
    createShoutOut() {
      isStore.actions
        .createShoutOutTripPlan(this.searchCriteria)
        .then((shoutOutId) => {
          // console.log(`Created shout-out, urn: ${shoutOutId}`)
          if (shoutOutId) {
            this.$router.push({
              name: 'shoutOutSubmittedPage',
              params: { shoutOutId },
            })
          }
        })
    },
    //TODO: Add sorting again.
    toggleSelectedSortModus() {
      this.selectedSortModusIndex =
        (this.selectedSortModusIndex + 1) % this.sortModi.length
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: $color-green;
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
.text-white {
  color: $color_white;
}
</style>
