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
                    <span class="form-label py-2">Personen</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
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
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row dense>
                  <v-col>
                    <span class="form-label py-2">Bagage</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col v-for="luggage in luggageSelected" :key="luggage.type">
                    <v-icon>{{ luggage.icon }}</v-icon>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row dense>
                  <v-col v-for="luggage in luggageTypes" :key="luggage.type">
                    <v-checkbox
                      v-model="luggageSelected"
                      hide-details
                      :label="luggage.label"
                      :value="luggage"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row dense>
                  <v-col>
                    <span>Overstappen</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col v-if="value.allowTransfer">
                    <v-icon>check</v-icon>
                  </v-col>
                  <v-col v-else>
                    <v-icon color="red">close</v-icon>
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
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row dense>
                  <v-col>
                    <span class="form-label py-2">Toestaan</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col
                    v-for="travelMode in allowedTravelModes"
                    :key="travelMode.mode"
                  >
                    <v-icon>{{ travelMode.icon }}</v-icon>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row dense>
                  <v-col
                    v-for="travelMode in travelModes"
                    :key="travelMode.mode"
                  >
                    <v-checkbox
                      v-model="allowedTravelModes"
                      hide-details
                      :label="travelMode.label"
                      :value="travelMode"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row dense>
                  <v-col>
                    <span class="form-label py-2">Maximale loopafstand</span>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>{{ value.maximumTransferTime }} min</v-col>
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
import travelModes from '@/constants/travel-modes.js'
import luggageTypes from '@/constants/luggage-types.js'

export default {
  name: 'SearchOptions',
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
// .v-expansion-panel {
//   box-shadow: none;
// }
//
// .menu-item {
//   height: 25px;
// }
</style>
