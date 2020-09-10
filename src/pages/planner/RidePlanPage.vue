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
              <v-row dense>
                <v-col>
                  <search-criteria
                    v-model="searchCriteria"
                    @locationFieldSelected="onLocationFieldSelected"
                    @criteriaChanged="onCriteriaChanged"
                  />
                </v-col>
              </v-row>
              <v-row dense>
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
                    <v-col v-if="!selectedCar" class="pl-3">
                      <router-link to="cars">
                        <span>Voer je auto in</span>
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
                  </v-row>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <corona-check
                    :value="coronaCheck"
                    class="mb-2"
                    @done="onCoronaCheckDone"
                  ></corona-check>
                  <v-btn
                    large
                    rounded
                    block
                    depressed
                    color="button"
                    :disabled="disabledRideAddition || !passedCoronaCheck"
                    @click="submitForm()"
                  >
                    Rit aanbieden
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  transition="slide-x-transition"
                  class="text-center body-2"
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
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'
import CoronaCheck from '@/components/common/CoronaCheck'
import coronaCheckMixin from '@/mixins/coronaCheckMixin'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'RidePlanPage',
  components: {
    CoronaCheck,
    ContentPane,
    SearchCriteria,
    RecurrenceEditor,
  },
  mixins: [coronaCheckMixin],
  data() {
    return {
      recurrence: undefined,
    }
  },
  computed: {
    searchCriteria() {
      return isStore.getters.getSearchCriteria
    },
    selectedCar() {
      const selectedCarId =
          psStore.getters.getProfile.ridePlanOptions.selectedCarId,
        cars = csStore.getters.getAvailableCars
      return cars.find(car => car.id === selectedCarId)
    },
    disabledRideAddition() {
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
    csStore.actions.fetchCars()
    this.initialize()
  },
  beforeRouteEnter: beforeRouteEnter({
    recurrence: json => json,
  }),
  beforeRouteLeave: beforeRouteLeave({
    recurrence: model => model && { ...model },
  }),
  methods: {
    initialize() {
      const { from, to } = gsStore.getters.getPickedLocation
      const { travelTime } = this.searchCriteria
      let newCriteria = {
        ...this.searchCriteria,
      }
      //TODO: move mapping from geo location to geocode sevice.
      if (from.position) {
        newCriteria.from = {
          label: `${from.title} ${from.vicinity || ''}`,
          latitude: from.position[0],
          longitude: from.position[1],
        }
      }
      if (to.position) {
        newCriteria.to = {
          label: `${to.title} ${to.vicinity || ''}`,
          latitude: to.position[0],
          longitude: to.position[1],
        }
      }
      if (!travelTime) {
        // Set the default date and time to today and the next whole hour.
        newCriteria.travelTime = {
          when: this.topOfTheHour,
          arriving: true,
        }
      }
      isStore.mutations.setSearchCriteria(newCriteria)
    },
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
    submitForm() {
      const { ridePlanOptions } = psStore.getters.getProfile
      csStore.actions.submitRide({
        ...this.searchCriteria,
        recurrence: this.recurrence,
        ridePlanOptions,
      })
      this.$router.push('/planSubmitted')
    },
  },
}
</script>
