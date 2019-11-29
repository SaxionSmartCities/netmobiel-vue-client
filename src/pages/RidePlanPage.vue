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
                  <date-time-selector />
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
                    :disabled="!locationsPickedCheck"
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
import moment from 'moment'
import FromToFields from '@/components/common/FromToFields.vue'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'

export default {
  name: 'RidePlanPage',
  components: {
    FromToFields,
    DateTimeSelector,
  },
  computed: {
    date: {
      get: function() {
        return this.$store.getters['ui/getTempValue']('rideDate')
      },
      set: function(value) {
        this.$store.commit('ui/setTempValue', { rideDate: value })
      },
    },
    time: {
      get: function() {
        return this.$store.getters['ui/getTempValue']('rideTime')
      },
      set: function(value) {
        this.$store.commit('ui/setTempValue', { rideTime: value })
      },
    },
    locationsPickedCheck: function() {
      const fromLoc = this.$store.getters['gs/getPickedLocation'].from
      const toLoc = this.$store.getters['gs/getPickedLocation'].to
      const cars = this.$store.getters['ps/getProfile'].ridePlanOptions.cars
      //return fromLoc.title !== undefined && toLoc.title !== undefined
      return (
        fromLoc.address !== undefined &&
        toLoc.address !== undefined &&
        cars.length > 0
      )
    },
    fromLocationLabel() {
      const suggestion = this.$store.getters['gs/getPickedLocation'].from
      return !suggestion.title
        ? 'Klik hier voor vertrekplek'
        : `${suggestion.title} ${suggestion.vicinity}`
    },
    toLocationLabel() {
      const suggestion = this.$store.getters['gs/getPickedLocation'].to
      return !suggestion.title
        ? 'Klik hier voor bestemming'
        : `${suggestion.title} ${suggestion.vicinity}`
    },
    availableCars() {
      return this.$store.getters['ps/getProfile'].ridePlanOptions.cars
    },
    selectedCar() {
      const selectedCarId = this.$store.getters['ps/getProfile'].ridePlanOptions
          .selectedCarId,
        cars = this.$store.getters['ps/getProfile'].ridePlanOptions.cars
      return cars.find(car => car.id === selectedCarId)
    },
  },
  methods: {
    swapLocations() {
      this.$store.commit('gs/swapLocations')
    },
    toLocationSuggestionsPage(field) {
      this.$router.push({ name: 'searchLocation', params: { field: field } })
    },
    toRidePlanOptions() {
      this.$router.push('/planOptions')
    },
    submitForm() {
      let pickedGeoLocations = this.$store.getters['gs/getPickedLocation']
      let from = pickedGeoLocations.from
      let to = pickedGeoLocations.to
      let ridePlanOptions = this.$store.getters['ps/getProfile'].ridePlanOptions
      let selectedTime = moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm')
      let rideDetails = { from, to, ridePlanOptions, selectedTime }
      this.$store.dispatch('cs/submitRide', rideDetails)
      this.$router.push('/planSubmitted')
    },
  },
}
</script>

<style lang="scss">
.car-model {
  font-style: italic;
  color: #9b9b9b;
  font-size: 80%;
}
</style>
