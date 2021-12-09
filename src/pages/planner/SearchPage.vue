<template>
  <content-pane class="background-primary">
    <v-row class="full-height justify-center align-center">
      <v-col>
        <v-expand-transition>
          <v-row>
            <v-col class="box-widget background-white">
              <v-form>
                <v-row dense>
                  <v-col>
                    <h1>Waar wil je heen?</h1>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <search-criteria
                      v-model="searchCriteria"
                      @locationFieldSelected="onLocationFieldSelected"
                      @criteriaChanged="onCriteriaChanged"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn
                      large
                      rounded
                      block
                      depressed
                      color="button"
                      :disabled="disabledSubmit"
                      @click="submitForm()"
                    >
                      Plan je rit!
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    class="body-2 text-center"
                    transition="slide-x-transition"
                    @click="toSearchPreferences"
                  >
                    <v-icon>settings</v-icon>
                    <span class="ml-1">Ritvoorkeuren</span>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import SearchCriteria from '@/components/common/SearchCriteria.vue'
import { geoPlaceToCriteria } from '@/utils/Utils'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'
import * as isStore from '@/store/itinerary-service'

export default {
  components: {
    ContentPane,
    SearchCriteria,
  },
  beforeRouteEnter(to, from, next) {
    // console.log(`beforeRouteEnter: ${from.name} --> ${to.name}`)
    const keepWhenComingFrom = [
      'searchLocation',
      'searchOptions',
      'searchResults',
    ]
    // Clear the search location when navigating from a different page than the location lookup page of one of the subpages
    if (!keepWhenComingFrom.includes(from?.name)) {
      gsStore.mutations.clearAllGeoLocationPicked()
      isStore.mutations.setSearchCriteria({})
    }
    next()
  },
  computed: {
    searchCriteria() {
      return isStore.getters.getSearchCriteria
    },
    disabledSubmit() {
      const { from, to, travelTime } = this.searchCriteria
      return !from?.label || !to?.label || travelTime?.when < moment()
    },
    topOfTheHour() {
      const now = moment()
      return now.minute() || now.second() || now.millisecond()
        ? now.add(1, 'hour').startOf('hour')
        : now.startOf('hour')
    },
  },
  mounted() {
    const { searchPreferences } = psStore.getters.getProfile
    const fromPlace = gsStore.getters.getPickedLocations.get('from')?.place
    const toPlace = gsStore.getters.getPickedLocations.get('to')?.place
    const { travelTime } = this.searchCriteria
    let newCriteria = {
      ...this.searchCriteria,
      preferences: searchPreferences,
      from: geoPlaceToCriteria(fromPlace),
      to: geoPlaceToCriteria(toPlace),
    }
    if (!travelTime) {
      // Set the default date and time to today and the next whole hour.
      newCriteria.travelTime = {
        when: this.topOfTheHour,
        arriving: false,
      }
    }
    isStore.mutations.setSearchCriteria(newCriteria)
  },
  methods: {
    onLocationFieldSelected(newField) {
      this.$router.push({
        name: 'searchLocation',
        params: { field: newField.field, editSearchCriteria: false.toString() },
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
    },
    toSearchPreferences() {
      this.$router.push({ name: 'searchOptions' })
    },
    submitForm() {
      isStore.actions.searchTripPlan(this.searchCriteria)
      this.$router.push({
        name: 'searchResults',
        params: {
          tripId: '-1',
        },
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
