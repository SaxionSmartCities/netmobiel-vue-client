<template>
  <content-pane class="background-primary">
    <v-row class="full-height justify-center align-center">
      <v-col>
        <v-row>
          <v-col class="box-widget background-white">
            <v-form>
              <v-row dense>
                <v-col>
                  <h1>Waar rijd je heen?</h1>
                </v-col>
              </v-row>
              <v-row>
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
                  <recurrence-editor
                    v-model="recurrence"
                    :origin="
                      searchCriteria.travelTime
                        ? searchCriteria.travelTime.when
                        : null
                    "
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-row dense>
                    <v-col cols="1">
                      <v-icon>directions_car</v-icon>
                    </v-col>
                    <v-col v-if="!selectedCar">
                      <router-link to="cars">
                        <span :class="[{ 'color-alert-red': warnMissingCar }]"
                          >Voer je auto in</span
                        >
                      </router-link>
                    </v-col>
                    <v-col v-else class="pl-3">
                      <router-link to="cars">
                        <span> {{ selectedCar.licensePlate }}</span>
                      </router-link>
                      <div class="car-model">
                        {{ selectedCar.brand }}
                        {{ selectedCar.model }}
                      </div>
                    </v-col>
                    <v-col v-if="ridePlanOptions && selectedCar">
                      {{ maxPassengers }}
                      <span v-if="maxPassengers === 1">plaats</span>
                      <span v-else>plaatsen</span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <v-btn
                    large
                    rounded
                    block
                    depressed
                    color="button"
                    :disabled="!inputComplete || busySubmitting"
                    @click="onPlanRide()"
                  >
                    Rit aanbieden
                    <v-icon dark right>error_outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col class="shrink">
                  <v-progress-circular
                    v-if="busySubmitting"
                    indeterminate
                    color="button"
                  ></v-progress-circular>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  transition="slide-x-transition"
                  class="text-center body-2 clickable-item"
                  @click="toRidePlanOptions()"
                >
                  <v-icon>settings</v-icon>
                  <span class="ml-1">Ritvoorkeuren</span>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import SearchCriteria from '@/components/common/SearchCriteria.vue'
import RecurrenceEditor from '@/components/common/RecurrenceEditor.vue'
import { geoPlaceToCriteria } from '@/utils/Utils'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'
import * as isStore from '@/store/itinerary-service'
import {
  beforeRouteLeave,
  restoreDataBeforeRouteEnter,
} from '@/utils/navigation'

export default {
  name: 'RidePlanPage',
  components: {
    ContentPane,
    SearchCriteria,
    RecurrenceEditor,
  },
  beforeRouteEnter(to, from, next) {
    // console.log(`beforeRouteEnter: ${from.name} --> ${to.name}`)
    const keepWhenComingFrom = [
      'searchLocation',
      'CarsPage',
      'planOptions',
      'rideDetailPage',
    ]
    // Clear the search location when navigating from a different page than the location lookup page of one of the subpages
    if (!keepWhenComingFrom.includes(from?.name)) {
      // console.log(`Clear Search Criteria`)
      gsStore.mutations.clearAllGeoLocationPicked()
      isStore.mutations.setSearchCriteria({})
    }
    next((vm) =>
      restoreDataBeforeRouteEnter(vm, {
        recurrence: (value) => value,
      })
    )
  },
  beforeRouteLeave: beforeRouteLeave({
    recurrence: (model) => model && { ...model },
  }),
  data() {
    return {
      recurrence: undefined,
      warnMissingCar: false,
      busySubmitting: false,
    }
  },
  computed: {
    searchCriteria() {
      return isStore.getters.getSearchCriteria
    },
    ridePlanOptions() {
      return psStore.getters.getProfile?.ridePlanOptions
    },
    selectedCar() {
      return csStore.getters.getSelectedCar
    },
    inputComplete() {
      const { from, to, travelTime } = this.searchCriteria
      return from?.label && to?.label && travelTime?.when > moment()
    },
    topOfTheHour() {
      const now = moment()
      return now.minute() || now.second() || now.millisecond()
        ? now.add(1, 'hour').startOf('hour')
        : now.startOf('hour')
    },
    maxPassengers() {
      return Math.min(
        this.ridePlanOptions.maxPassengers,
        (this.selectedCar?.nrSeats ?? 1) - 1
      )
    },
  },
  mounted() {
    const fromPlace = gsStore.getters.getPickedLocations.get('from')?.place
    const toPlace = gsStore.getters.getPickedLocations.get('to')?.place
    const { travelTime } = this.searchCriteria
    let newCriteria = {
      ...this.searchCriteria,
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
    toRidePlanOptions() {
      this.$router.push('/planOptions')
    },
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
    onPlanRide() {
      const { ridePlanOptions } = psStore.getters.getProfile
      if (!ridePlanOptions.selectedCarRef) {
        uiStore.actions.queueInfoNotification('Voeg eerst een auto toe.')
        this.warnMissingCar = true
        return
      }
      this.busySubmitting = true
      csStore.actions
        .submitRide({
          ...this.searchCriteria,
          recurrence: this.recurrence,
          ridePlanOptions,
        })
        .then(() => {
          this.busySubmitting = false
          this.$router.push('/planSubmitted')
        })
        .catch(() => {
          this.busySubmitting = false
        })
    },
  },
}
</script>
<style lang="scss" scoped></style>
