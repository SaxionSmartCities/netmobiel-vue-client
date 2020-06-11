<template>
  <content-pane class="background-primary">
    <v-row class="full-height justify-center align-center">
      <v-col cols="11">
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
                  <from-to-fields />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <date-time-selector
                    v-model="journeyMoment"
                    :allowed-dates="allowedDates"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <recurrence-editor
                    v-model="recurrence"
                    :origin="journeyMoment ? journeyMoment.when : null"
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
                  <v-btn
                    large
                    rounded
                    block
                    color="button"
                    :disabled="disabledRideAddition()"
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
import ContentPane from '@/components/common/ContentPane.vue'
import moment from 'moment'

import FromToFields from '@/components/common/FromToFields.vue'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'
import RecurrenceEditor from '@/components/common/RecurrenceEditor.vue'

import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'

export default {
  name: 'RidePlanPage',
  components: {
    ContentPane,
    FromToFields,
    DateTimeSelector,
    RecurrenceEditor,
  },
  data() {
    return {
      journeyMoment: undefined,
      recurrence: undefined,
    }
  },
  computed: {
    selectedCar() {
      const selectedCarId = this.$store.getters['ps/getProfile'].ridePlanOptions
          .selectedCarId,
        cars = this.$store.getters['cs/getAvailableCars']
      return cars.find(car => car.id === selectedCarId)
    },
  },
  mounted() {
    this.$store.dispatch('cs/fetchCars')
  },
  beforeRouteEnter: beforeRouteEnter({
    journeyMoment: DateTimeSelector.restoreModel,
    recurrence: json => json,
  }),
  beforeRouteLeave: beforeRouteLeave({
    journeyMoment: DateTimeSelector.saveModel,
    recurrence: model => model && { ...model },
  }),
  methods: {
    disabledRideAddition() {
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      return (
        !from.title ||
        !to.title ||
        !this.journeyMoment ||
        !this.selectedCar ||
        this.journeyMoment.when < moment().add(1, 'hour')
      )
    },
    toRidePlanOptions() {
      this.$router.push('/planOptions')
    },
    submitForm() {
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      this.$store.dispatch('cs/submitRide', {
        from,
        to,
        ridePlanOptions: this.$store.getters['ps/getProfile'].ridePlanOptions,
        recurrence: this.recurrence,
        timestamp: this.journeyMoment,
      })
      this.$router.push('/planSubmitted')
    },
    allowedDates(v) {
      return moment(v) >= moment().startOf('day')
    },
  },
}
</script>
