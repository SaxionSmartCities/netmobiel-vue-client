<template>
  <content-pane>
    <template v-slot:header>
      <h1 class="pl-3 pt-3">
        Riteigenschappen
      </h1>
    </template>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <v-col>
            <v-expansion-panels accordion>
              <v-expansion-panel>
                <v-expansion-panel-header
                  :class="{
                    'disable-icon-rotate': maxNrOfPersons <= 1,
                  }"
                >
                  <v-row no-gutters>
                    <v-col>
                      <span class="form-label">Max. aantal passagiers</span>
                    </v-col>
                    <v-col cols="1" class="text-right">
                      {{ numPassengers }}
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col>
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
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters justify="space-between">
                    <v-col align-self="center">
                      <span class="form-label">Bagage</span>
                    </v-col>
                    <v-col cols="7" class="text-right">
                      <span
                        v-for="luggage in luggageSelected"
                        :key="luggage.type"
                      >
                        <v-icon> {{ luggage.icon }}</v-icon>
                      </span>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row dense>
                    <v-col
                      v-for="luggage in luggageTypes"
                      :key="luggage.type"
                      :cols="6"
                    >
                      <v-checkbox
                        v-model="luggageSelected"
                        hide-details
                        :label="luggage.label"
                        :value="luggage"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col>
                      <span class="form-label py-2">Maximale omrijtijd</span>
                    </v-col>
                    <v-col cols="3" class="text-right">
                      {{ maxMinutesDetour }} min
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row dense>
                    <v-col>
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
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn large rounded block depressed color="button" @click="save">
              Voorkeuren opslaan
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import luggageTypes from '@/constants/luggage-types.js'

export default {
  name: 'RidePreferences',
  components: {
    ContentPane,
  },
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
      console.log('luggageTypes', luggageTypes)
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
