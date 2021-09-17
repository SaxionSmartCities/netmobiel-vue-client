<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <v-row dense>
          <v-col>
            <h1>
              Ritvoorkeuren
            </h1>
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
                      <span>Max. aantal passagiers</span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-end pr-2">
                      {{ ridePlanOptions.numPassengers }}
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row no-gutters>
                    <v-col>
                      <v-slider
                        v-if="maxNrOfPersons > 1"
                        v-model="ridePlanOptions.numPassengers"
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
                  newLugagge => {
                    luggage = newLugagge
                  }
                "
              />
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col>
                      <span class="form-label py-2">Maximale omrijtijd</span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-end pr-2">
                      {{ ridePlanOptions.maxMinutesDetour }} min
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row dense>
                    <v-col>
                      <v-slider
                        v-model="ridePlanOptions.maxMinutesDetour"
                        class="px-4"
                        thumb-color="thumb-grey"
                        thumb-label
                        ticks="always"
                        tick-size="2"
                        :tick-labels="detourOptions"
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
import SearchOptionsIconExpansionPanel from '@/components/search/SearchOptionsIconExpansionPanel.vue'
import luggageTypes from '@/constants/luggage-types.js'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

export default {
  name: 'RidePreferences',
  components: {
    ContentPane,
    SearchOptionsIconExpansionPanel,
  },
  data() {
    return {
      maxNrOfPersons: 4,
      ridePlanOptions: {},
      detourOptions: [0, 5, 10, 15, 20],
      luggageSelected: [],
    }
  },
  computed: {
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
            .map(o => luggageTypes[o])
            // filter away the non-existing types
            .filter(lt => lt),
        }
      },
      set(selection) {
        this.ridePlanOptions.luggageOptions = selection.selected.map(
          option => option.type
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
    if (this.ridePlanOptions.numPassengers > this.maxNrOfPersons) {
      this.ridePlanOptions.numPassengers = this.maxNrOfPersons
    }
  },
  methods: {
    save() {
      psStore.actions.storeRidePreferences(this.ridePlanOptions)
      this.$router.go(-1)
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
