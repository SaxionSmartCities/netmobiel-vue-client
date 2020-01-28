<template>
  <v-row dense>
    <v-col>
      <v-row dense>
        <v-col>
          <v-expansion-panels accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row dense>
                  <v-col>
                    <span>Personen</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col class="text-end pr-5">
                    {{ value.numPassengers }}
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row dense>
                  <v-col>
                    <v-slider
                      v-model="value.numPassengers"
                      thumb-color="thumb-grey"
                      thumb-label
                      ticks="always"
                      tick-size="2"
                      class="px-4"
                      :tick-labels="generatePersonRange"
                      :min="1"
                      :max="maxNrOfPersons"
                    />
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <search-options-icon-expansion-panel v-model="luggage" />
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row dense>
                  <v-col>
                    <span>Overstappen</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col class="text-end pr-3">
                    <v-icon v-if="value.allowTransfer">check</v-icon>
                    <v-icon v-else color="red">close</v-icon>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row dense>
                  <v-col>
                    <v-alert
                      :value="showOverstapAlert"
                      type="warning"
                      color="orange"
                    >
                      Let op: Als overstappen wordt uitgeschakeld is het alleen
                      mogelijk om u te matchen met een directe rit. In veel
                      gevallen zal dit niet mogelijk zijn. Het uitzetten van
                      deze optie zal resulteren in een sterk verminderd aantal
                      reisopties.
                    </v-alert>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    Overstappen
                  </v-col>
                  <v-col>
                    <v-switch v-model="value.allowTransfer" color="green">
                    </v-switch>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <search-options-icon-expansion-panel v-model="travel" />
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row dense>
                  <v-col>
                    <span class="form-label py-2">Maximale loopafstand</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col class="text-end pr-3">
                    {{ value.maximumTransferTime }} meter
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row dense>
                  <v-col>
                    <v-slider
                      v-model="value.maximumTransferTime"
                      thumb-color="thumb-grey"
                      thumb-label
                      ticks="always"
                      tick-size="2"
                      :tick-labels="generateMinuteRange"
                      min="0"
                      max="30"
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
          <v-btn
            large
            rounded
            block
            depressed
            color="button"
            @click="$emit('onSearchOptionsSave')"
          >
            Voorkeuren opslaan
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import SearchOptionsIconExpansionPanel from './SearchOptionsIconExpansionPanel.vue'
import travelModes from '@/constants/travel-modes.js'
import luggageTypes from '@/constants/luggage-types.js'

export default {
  name: 'SearchOptions',
  components: {
    SearchOptionsIconExpansionPanel,
  },
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      maxNrOfPersons: 4,
      showOverstapAlert: true,
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
    travel: {
      get() {
        return {
          title: 'Toestaan',
          options: travelModes,
          selected: this.value.allowedTravelModes
            .map(mode => travelModes[mode])
            .filter(x => !!x), // Filter out the undefined travel modes.
        }
      },
      set(selection) {
        console.log(selection)
      },
    },
    luggage: {
      get() {
        return {
          title: 'Bagage',
          options: luggageTypes,
          selected: this.value.luggageOptions.map(o => luggageTypes[o]),
        }
      },
      set(selection) {
        console.log(selection)
      },
    },
    luggageSelected: {
      get() {
        return this.value.luggageOptions.map(option => luggageTypes[option])
      },
      set(selection) {
        this.value.luggageOptions = selection.map(x => x.type)
      },
    },
    luggageTypes() {
      return luggageTypes
    },
    allowedTravelModes: {
      get() {
        return this.value.allowedTravelModes
          .map(mode => travelModes[mode])
          .filter(x => !!x) // Filter out the undefined travel modes.
      },
      set(selection) {
        this.value.allowedTravelModes = selection.map(x => x.mode)
      },
    },
    travelModes() {
      return travelModes
    },
    generateMinuteRange: function() {
      let result = []
      for (let i = 0; i <= 30; i += 5) {
        result.push(i)
      }
      return result
    },
  },
}
</script>

<style lang="scss">
.v-expansion-panel-header {
  padding: 10px 0;
  box-shadow: none;
}
</style>
