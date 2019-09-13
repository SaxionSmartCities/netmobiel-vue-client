<template>
  <v-container data-app>
    <v-layout column>
      <v-flex>
        <h5 class="headline font-weight-medium">Riteigenschappen</h5>
      </v-flex>

      <v-flex my-3>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <div slot="header">
              <v-layout>
                <v-flex xs7>
                  <span class="form-label py-2">Passagiers</span>
                </v-flex>
                <v-flex text-right pr-2>
                  {{ numPassengers }}
                </v-flex>
              </v-layout>
            </div>
            <v-layout>
              <v-flex mt-3>
                <v-slider
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
          <v-expansion-panel-content>
            <div slot="header">
              <v-layout>
                <v-flex xs10>
                  <span class="form-label py-2">Bagage</span>
                </v-flex>
                <v-flex>
                  <v-layout pr-3>
                    <v-flex
                      v-for="luggage in luggageSelected"
                      :key="luggage.type"
                    >
                      <v-icon>{{ luggage.icon }}</v-icon>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
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

          <v-expansion-panel-content>
            <div slot="header">
              <v-layout>
                <v-flex xs7>
                  <span class="form-label py-2">Maximale omrijtijd</span>
                </v-flex>
                <v-flex text-xs-right pr-2 text-right>
                  {{ maxMinutesDetour }} min
                </v-flex>
              </v-layout>
            </div>
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

          <v-expansion-panel-content>
            <div slot="header">
              <v-layout>
                <v-flex xs7>
                  <span class="form-label py-2">Auto</span>
                </v-flex>
                <v-flex v-if="selectedCar !== undefined" text-right pr-2>
                  {{ selectedCar.model }}
                </v-flex>
              </v-layout>
            </div>
            <v-layout>
              <v-flex px-4>
                <v-layout row wrap>
                  <v-flex
                    v-for="car in cars"
                    :key="car.licensePlate"
                    xs12
                    class="my-2 elevation-1"
                    :class="{
                      active:
                        selectedCar !== undefined &&
                        selectedCar.licensePlate === car.licensePlate,
                    }"
                    @click="selectCar(car)"
                  >
                    <v-layout>
                      <v-flex xs5 pa-2>
                        <!-- <v-img :src="car.image" height="100%" /> -->
                        <v-img :src="image" height="100%" />
                      </v-flex>
                      <v-flex>
                        <v-layout
                          column
                          justify-center
                          align-center
                          fill-height
                        >
                          <v-flex shrink>
                            <h3>{{ car.model }}</h3>
                          </v-flex>
                          <v-flex shrink> {{ car.licensePlate }} </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-btn class="mt-3" block outline color="blue"
                    >Andere auto toevoegen?</v-btn
                  >
                </v-layout>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex>
        <v-btn large round block @click="save">Save</v-btn>
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
      luggageSelected: [],
      maxMinutesDetour: 0,
      image: require('@/assets/placeholder_car.png'),
      cars: [
        {
          image: 'some/nonexistant.png',
          model: 'Ford Fiesta',
          licensePlate: '1-ABC-30',
          nrOfSeats: 4,
        },
        {
          image: 'some/nonexistant.png',
          model: 'Dacia Duster',
          licensePlate: '2-DEF-50',
          nrOfSeats: 2,
        },
      ],
      selectedCar: undefined,
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
    let ridePlanOptions = this.$store.getters['ps/getProfile'].ridePlanOptions

    this.luggageSelected = ridePlanOptions.luggageOptions.map(option =>
      this.parseLuggageOption(option)
    )
    this.numPassengers = ridePlanOptions.numPassengers
    this.maxMinutesDetour = ridePlanOptions.maxMinutesDetour
    this.selectedCar = ridePlanOptions.car
  },
  methods: {
    selectCar: function(car) {
      this.selectedCar = car
      this.maxNrOfPersons = car.nrOfSeats
    },
    save: function() {
      let payload = {
        luggageOptions: this.luggageSelected.map(x => x.type),
        numPassengers: this.numPassengers,
        maxMinutesDetour: this.maxMinutesDetour,
        car: this.selectedCar,
      }

      this.$store.dispatch('ps/storeRidePlanOptions', payload)
      this.$router.go(-1)
    },
    parseLuggageOption: function(luggage) {
      //TODO: Rename ROLLATOR to WALKER
      const luggageOptions = {
        STROLLER: {
          type: 'STROLLER',
          label: 'Buggy',
          icon: 'child_friendly',
        },
        HANDLUGGAGE: {
          type: 'HANDLUGGAGE',
          label: 'Handbagage',
          icon: 'work',
        },
        PET: {
          type: 'PET',
          label: 'Huisdier',
          icon: 'pets',
        },
        ROLLATOR: {
          type: 'ROLLATOR',
          label: 'Rollator',
          icon: 'fa-crutch',
        },
        WHEELCHAIR: {
          type: 'WHEELCHAIR',
          label: 'Rolstoel',
          icon: 'accessible_forward',
        },
      }
      return luggageOptions[luggage]
    },
    parseTravelMode: function(mode) {
      const icons = {
        WALK: 'directions_walk',
        CAR: 'directions_car',
        TRAIN: 'train',
        BUS: 'directions_bus',
        RAIL: 'directions_railway',
        BIKE: 'directions_bike',
      }
      const labels = {
        WALK: 'Lopen',
        CAR: 'Auto',
        TRAIN: 'Trein',
        BUS: 'Bus',
        RAIL: 'Tram',
        BIKE: 'Fiets',
      }
      return {
        icon: icons[mode],
        label: labels[mode],
        mode: mode,
      }
    },
  },
}
</script>

<style lang="scss">
.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}

.v-expansion-panel {
  box-shadow: none;
}

.active {
  background-color: $color-green;
  color: $color-white;
}
</style>
