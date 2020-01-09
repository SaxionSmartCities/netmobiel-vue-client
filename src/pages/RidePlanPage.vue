<template>
  <v-container
    align-center
    justify-center
    fill-height
    fluid
    grid-list-lg
    class="background-primary"
  >
    <v-layout justify-center align-center>
      <v-flex xs11 sm9 md6>
        <v-layout column shrink>
          <v-flex class="box-widget background-white">
            <v-form>
              <v-layout column>
                <v-flex text-xs-center>
                  <h1>Waar rijd je heen?</h1>
                </v-flex>
                <v-flex>
                  <from-to-fields />
                </v-flex>
                <v-flex>
                  <date-time-selector
                    v-model="journeyMoment"
                    :allowed-dates="allowedDates"
                  />
                </v-flex>
                <v-flex>
                  <recurrence-editor
                    v-model="recurrence"
                    :origin="journeyMoment ? journeyMoment.when : null"
                  />
                </v-flex>
                <v-flex>
                  <v-layout mt-1 row>
                    <v-flex pl-2 shrink>
                      <span class="form-label font-weight-bold">
                        Auto
                      </span>
                      <!-- <v-icon>emoji_transportation</v-icon> -->
                    </v-flex>
                    <v-flex v-if="!selectedCar">
                      <router-link to="profileCars">
                        <span>Invoeren</span>
                      </router-link>
                    </v-flex>
                    <v-flex v-else>
                      <router-link to="profileCars">
                        <span> {{ selectedCar.licensePlate }}</span>
                      </router-link>
                      <div class="car-model">
                        {{ selectedCar.brand }}
                        {{ selectedCar.model }}
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>

              <v-layout mt-2 justify-center text-xs-center>
                <v-flex>
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
                </v-flex>
              </v-layout>
              <v-layout mt-2 justify-center>
                <v-flex
                  shrink
                  transition="slide-x-transition"
                  @click="toRidePlanOptions()"
                >
                  <v-icon>settings</v-icon>
                  <span class="ml-1">Ritvoorkeuren</span>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import FromToFields from '@/components/common/FromToFields.vue'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'
import RecurrenceEditor from '@/components/common/RecurrenceEditor.vue'

import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'

export default {
  name: 'RidePlanPage',
  components: {
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
        cars = this.$store.getters['ps/getProfile'].ridePlanOptions.cars
      return cars.find(car => car.id === selectedCarId)
    },
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
      return !from.title || !to.title || !this.journeyMoment
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
        selectedTime: this.journeyMoment.when,
      })
      this.$router.push('/planSubmitted')
    },
    allowedDates(v) {
      return new Date(v) > new Date()
    },
  },
}
</script>
