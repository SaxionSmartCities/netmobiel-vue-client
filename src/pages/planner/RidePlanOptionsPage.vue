<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <v-row dense>
          <v-col>
            <h1>Ritvoorkeuren</h1>
          </v-col>
        </v-row>
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
                      <span
                        >Max. aantal passagiers (als de auto het toelaat)</span
                      >
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-end pr-2">
                      {{ ridePlanOptions.maxPassengers }}
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col>
                      <v-slider
                        v-if="maxNrOfPersons > 1"
                        v-model="ridePlanOptions.maxPassengers"
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
              <search-options-icon-expansion-panel
                v-model="luggage"
                @onChanged="
                  (newLuggage) => {
                    luggage = newLuggage
                  }
                "
              />
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col>
                      <span class="form-label py-2">Maximale omrijafstand</span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-end pr-2">
                      {{ detourDistance }} km
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row dense>
                    <v-col>
                      <v-slider
                        v-model="detourDistanceIndex"
                        class="px-4"
                        thumb-color="thumb-grey"
                        thumb-label
                        ticks="always"
                        tick-size="2"
                        :tick-labels="detourDistanceOptions"
                        min="0"
                        :max="detourDistanceOptions.length - 1"
                        step="1"
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
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-end pr-2"> {{ detourTime }} min </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row dense>
                    <v-col>
                      <v-slider
                        v-model="detourTimeIndex"
                        class="px-4"
                        thumb-color="thumb-grey"
                        thumb-label
                        ticks="always"
                        tick-size="2"
                        :tick-labels="detourTimeOptions"
                        min="0"
                        :max="detourTimeOptions.length - 1"
                        step="1"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col>
                      <span>Hulp bieden bij instappen</span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-end pr-3">
                      <v-icon v-if="ridePlanOptions.ableToAssist">check</v-icon>
                      <v-icon v-else color="red">close</v-icon>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col>
                      <v-alert type="warning" icon="warning" text dense>
                        Indien je de passagier hulp kunt bieden bij het in- en
                        uitstappen, dan kun je dat hier aangeven.
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="shrink" cols="10">
                      Ik kan hulp bieden bij in- en uitstappen:
                    </v-col>
                    <v-col class="shrink">
                      <v-switch
                        v-model="ridePlanOptions.ableToAssist"
                        class="switch-overwrite"
                        color="green"
                      >
                      </v-switch>
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
import SearchOptionsIconExpansionPanel from '@/components/search/SearchOptionsIconExpansionPanel.vue'
import luggageTypes from '@/constants/luggage-types.js'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import { findClosestIndexOf } from '@/utils/Utils'

export default {
  name: 'RidePreferences',
  components: {
    ContentPane,
    SearchOptionsIconExpansionPanel,
  },
  data() {
    return {
      maxNrOfPersons: 8,
      ridePlanOptions: {},
      detourTimeOptions: [15, 30, 45, 60],
      detourTimeIndex: 0,
      detourDistanceOptions: [5, 10, 20, 50, 100],
      detourDistanceIndex: 0,
      luggageSelected: [],
    }
  },
  computed: {
    detourTime() {
      return this.detourTimeOptions[this.detourTimeIndex]
    },
    detourDistance() {
      return this.detourDistanceOptions[this.detourDistanceIndex]
    },
    generatePersonRange() {
      let result = []
      for (let i = 1; i <= this.maxNrOfPersons; i++) {
        result.push(i)
      }
      return result
    },
    luggage: {
      get() {
        return {
          title: 'Bagage',
          options: luggageTypes,
          selected: this.ridePlanOptions.luggageOptions
            .map((o) => luggageTypes[o])
            // filter away the non-existing types
            .filter((lt) => lt),
        }
      },
      set(selection) {
        this.ridePlanOptions.luggageOptions = selection.selected.map(
          (option) => option.type
        )
      },
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    // Clone search preferences so we can pass it as v-model and persist it
    // when onSearchOptionsSave is emitted.
    this.ridePlanOptions = {
      ...psStore.getters.getProfile.ridePlanOptions,
    }
    if (this.ridePlanOptions.maxPassengers > this.maxNrOfPersons) {
      this.ridePlanOptions.maxPassengers = this.maxNrOfPersons
    }
    // Find closest index for detourTime
    this.detourTimeIndex = findClosestIndexOf(
      this.ridePlanOptions.maxTimeDetour,
      this.detourTimeOptions
    )
    // Find closest index for detourDistance
    this.detourDistanceIndex = findClosestIndexOf(
      this.ridePlanOptions.maxDistanceDetour / 1000,
      this.detourDistanceOptions
    )
  },
  methods: {
    save() {
      this.ridePlanOptions.maxTimeDetour = this.detourTime
      this.ridePlanOptions.maxDistanceDetour = this.detourDistance * 1000
      psStore.actions
        .storeMyRidePreferences(this.ridePlanOptions)
        .then(() => psStore.actions.fetchMyProfile())
        .then(() => this.$router.go(-1))
    },
  },
}
</script>

<style lang="scss" scoped>
.v-expansion-panel-header {
  padding: 10px 0;
  box-shadow: none;
}
</style>
