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
            <v-flex>
              <v-form>
                <v-layout column>
                  <v-flex text-xs-center xs12>
                    <h1>Waar rijd je heen?</h1>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex id="vannaar" xs11>
                    <v-layout column>
                      <v-flex id="van">
                        <v-layout my-1 row>
                          <v-flex pl-4 xs5 sm3>
                            <span class="form-label font-weight-bold">
                              Van
                            </span>
                          </v-flex>
                          <v-flex
                            xs11
                            @click="toLocationSuggestionsPage('from')"
                          >
                            {{ fromLocationLabel }}
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex>
                        <v-layout my-1 row>
                          <v-flex pl-4 xs5 sm3>
                            <span class="form-label font-weight-bold">
                              Naar
                            </span>
                          </v-flex>
                          <v-flex xs11 @click="toLocationSuggestionsPage('to')">
                            {{ toLocationLabel }}
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex d-flex>
                    <v-layout column justify-center @click="swapLocations()">
                      <v-flex
                        id="heenweericoon"
                        text-xs-center
                        justify-center
                        shrink
                      >
                        <v-icon>import_export</v-icon>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <from-to-fields />
                  </v-flex>
                  <v-flex>
                    <date-time-selector />
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex xs11>
                    <v-layout column>
                      <v-flex>
                        <v-layout my-2 row>
                          <v-flex pl-4 sm3>
                            <span class="form-label font-weight-bold">
                              Auto
                            </span>
                          </v-flex>
                          <v-flex xs11>
                            <router-link
                              v-if="availableCars.length === 0"
                              to="/profileCars"
                            >
                              <span>Invoeren</span>
                            </router-link>
                            <div v-else>
                              <span> {{ availableCars[0].licensePlate }}</span>
                              <div class="car-model">
                                {{ availableCars[0].brand }}
                                {{ availableCars[0].model }}
                                {{ availableCars[0].color }}
                              </div>
                              <router-link to="profileCars">
                                <span v-if="availableCars.length > 1">
                                  Alternatief selecteren
                                </span>
                                <span v-else>
                                  Nieuwe invoeren
                                </span>
                              </router-link>
                            </div>
                          </v-flex>
                        </v-layout>
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
