<template>
  <v-container data-app>
    <v-layout column>
      <v-flex>
        <h5 class="headline font-weight-medium">Riteigenschappen</h5>
      </v-flex>

      <v-flex my-3>
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header
              :class="{
                'disable-icon-rotate': maxNrOfPersons <= 1,
              }"
            >
              <v-layout>
                <v-flex xs7>
                  <span class="form-label py-2">Passagiers</span>
                </v-flex>
                <v-flex text-right pr-2>
                  {{ numPassengers }}
                </v-flex>
              </v-layout>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout>
                <v-flex mt-3>
                  <v-slider
                    v-if="maxNrOfPersons > 1"
                    v-model="numPassengers"
                    class="px-4"
                    thumb-color="thumb-grey"
                    thumb-label
                    ticks="always"
                    tick-size="2"
                    :tick-labels="generatePersonRange"
                    :min="1"
                    :max="maxNrOfPersons"
                  />
                </v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-layout>
                <v-flex xs10>
                  <span class="form-label py-2">Bagage</span>
                </v-flex>
                <v-flex>
                  <v-layout v-if="luggageSelected.length > 0" pr-3>
                    <v-flex
                      v-for="luggage in luggageSelected"
                      :key="luggage.type"
                    >
                      <v-icon>{{ luggage.icon }}</v-icon>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout pb-4>
                <v-flex px-4>
                  <v-layout row wrap>
                    <v-flex
                      v-for="luggage in luggageTypes"
                      :key="luggage.type"
                      xs6
                    >
                      <v-checkbox
                        v-model="luggageSelected"
                        hide-details
                        :label="luggage.label"
                        :value="luggage"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-layout>
                <v-flex xs7>
                  <span class="form-label py-2">Maximale omrijtijd</span>
                </v-flex>
                <v-flex text-xs-right pr-2 text-right>
                  {{ maxMinutesDetour }} min
                </v-flex>
              </v-layout>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-layout>
                <v-flex mt-3>
                  <v-slider
                    v-model="maxMinutesDetour"
                    class="px-4"
                    thumb-color="thumb-grey"
                    thumb-label
                    ticks="always"
                    tick-size="2"
                    :tick-labels="generateMinuteRange"
                    min="0"
                    max="20"
                    step="5"
                  />
                </v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>

      <v-flex>
        <v-btn large rounded block @click="save">Save</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import luggageTypes from '@/constants/luggage-types.js'

export default {
  name: 'RidePreferences',
  data: function() {
    return {
      maxNrOfPersons: 4,
      numPassengers: 1,
      maxMinutesDetour: 0,
      luggageSelected: [],
      image: require('@/assets/placeholder_car.png'),
      cars: [],
      selectedCarId: undefined,
    }
  },
  computed: {
    luggageTypes: function() {
      return luggageTypes
    },
    generatePersonRange: function() {
      let result = []
      for (let i = 1; i <= this.maxNrOfPersons; i++) {
        result.push(i)
      }
      return result
    },
    generateMinuteRange: function() {
      let result = []
      for (let i = 0; i <= 20; i += 5) {
        result.push(i)
      }
      return result
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
  mounted() {
    let profile = this.$store.getters['ps/getProfile']
    this.numPassengers = profile.ridePlanOptions.numPassengers
    this.luggageSelected = profile.ridePlanOptions.luggageOptions.map(
      option => luggageTypes[option]
    )
    this.maxMinutesDetour = profile.ridePlanOptions.maxMinutesDetour
    this.cars = profile.ridePlanOptions.cars
    this.selectedCarId = profile.ridePlanOptions.selectedCarId
    let car = this.cars.find(car => car.id === this.selectedCarId)
    if (car) {
      this.maxNrOfPersons = car.nrSeats - 1
    } else {
      // Some default.
      this.maxNrOfPersons = 4
    }
    if (this.numPassengers > this.maxNrOfPersons) {
      this.numPassengers = this.maxNrOfPersons
    }
  },
  methods: {
    save: function() {
      let payload = {
        luggageOptions: this.luggageSelected.map(x => x.type),
        numPassengers: this.numPassengers,
        maxMinutesDetour: this.maxMinutesDetour,
        selectedCarId: this.selectedCarId,
        cars: this.cars,
      }
      this.$store.commit('ps/setRidePlanOptions', payload)
      let profile = this.$store.getters['ps/getProfile']
      this.$store.dispatch('ps/updateProfile', profile)
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss">
.v-expansion-panel {
  box-shadow: none;
}

.selected {
  background-color: $color-green;
  color: $color-white;
}

.disable-icon-rotate * .v-expansion-panel__header__icon {
  display: none;
}
</style>
