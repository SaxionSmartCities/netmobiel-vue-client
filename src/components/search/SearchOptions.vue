<template>
  <v-row dense>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <v-expansion-panels accordion>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row no-gutters>
                  <v-col>
                    <span>Aantal passagiers</span>
                  </v-col>
                </v-row>
                <v-row no-gutters>
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
            <search-options-icon-expansion-panel
              v-model="luggage"
              class="pa-0"
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
                    <span>Hulp nodig bij instappen</span>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col class="text-end pr-3">
                    <v-icon v-if="value.longerPickupTime">check</v-icon>
                    <v-icon v-else color="red">close</v-icon>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row no-gutters>
                  <v-col>
                    <v-alert type="warning" color="orange">
                      Indien u hulp nodig heeft bij het instappen dan kunt u dit
                      hier aangeven. Er wordt dan een verzoek verstuurd naar de
                      chauffeur om hier rekening mee te houden.
                    </v-alert>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col class="shrink" cols="10">
                    Ik heb hulp nodig met instappen:
                  </v-col>
                  <v-col class="shrink">
                    <v-switch
                      v-model="value.longerPickupTime"
                      class="switch-overwrite"
                      color="green"
                    >
                    </v-switch>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row no-gutters>
                  <v-col>
                    <span>Overstappen</span>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col class="text-end pr-3">
                    <v-icon v-if="value.allowFirstLegTransfer">check</v-icon>
                    <v-icon v-else color="red">close</v-icon>
                  </v-col>
                  <v-col class="text-end shrink pr-3">
                    <v-icon v-if="value.allowLastLegTransfer">check</v-icon>
                    <v-icon v-else color="red">close</v-icon>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row no-gutters>
                  <v-col>
                    <v-alert
                      :value="showOverstapAlert"
                      type="warning"
                      color="orange"
                    >
                      Let op: Als overstappen aan het begin en/of aan het einde
                      van uw rit wordt uitgeschakeld is het alleen mogelijk om u
                      te matchen met een gehele rit met het openbaar vervoer of
                      een directe rit. In veel gevallen zal dit niet mogelijk
                      zijn. Het uitzetten van deze optie zal resulteren in
                      snellere zoekresultaten maar ook in een sterk verminderd
                      aantal ritopties.
                    </v-alert>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col class="shrink" cols="10">
                    Meerijden bij begin van de rit:
                  </v-col>
                  <v-col class="shrink">
                    <v-switch
                      v-model="value.allowFirstLegTransfer"
                      class="switch-overwrite"
                      color="green"
                    >
                    </v-switch>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col class="my-0" cols="10">
                    Meerijden bij einde van de rit:
                  </v-col>
                  <v-col class="my-0">
                    <v-switch
                      v-model="value.allowLastLegTransfer"
                      class="switch-overwrite"
                      color="green"
                    >
                    </v-switch>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <search-options-icon-expansion-panel
              v-model="travel"
              @onChanged="
                newTravel => {
                  travel = newTravel
                }
              "
            />
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row no-gutters>
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
                      v-model="selectedWalkingDistance"
                      thumb-color="thumb-grey"
                      thumb-label
                      ticks="always"
                      tick-size="2"
                      :tick-labels="transferDistanceOptions"
                      min="0"
                      max="2000"
                      step="500"
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
      transferDistanceOptions: [250, 500, 1000, 1500, 2000],
    }
  },
  computed: {
    selectedWalkingDistance: {
      get() {
        return this.value.maximumTransferTime == 250
          ? 0
          : this.value.maximumTransferTime
      },
      set(newValue) {
        this.value.maximumTransferTime = newValue == 0 ? 250 : newValue
      },
    },
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
          title: 'Vervoersmiddelen',
          options: Object.keys(travelModes)
            .map(x => travelModes[x])
            .filter(x => !!x && x.visible), // Filter only visible travel modes.
          selected: this.value.allowedTravelModes
            .map(mode => travelModes[mode])
            .filter(x => !!x), // Filter out the undefined travel modes.
        }
      },
      set(selection) {
        this.value.allowedTravelModes = selection.selected.map(
          mode => mode.mode
        )
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
        this.value.luggageOptions = selection.selected.map(
          option => option.type
        )
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
  },
}
</script>

<style lang="scss" scoped>
.v-expansion-panel-header {
  padding: 10px 0;
  box-shadow: none;
}

.switch-overwrite {
  &.v-input--selection-controls {
    margin-top: 0px;
  }
}
.v-input__control {
  height: 32px !important;
}
</style>
