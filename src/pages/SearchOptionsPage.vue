<template>
  <v-container data-app>
    <v-layout column>
      <v-flex>
        <h5 class="headline font-weight-medium">Reisvoorkeuren</h5>
      </v-flex>

      <v-flex my-3>
        <v-expansion-panel>
          <v-expansion-panel-content>
            <div slot="header">
              <v-layout class="menu-item">
                <v-flex xs10>
                  <span class="form-label py-2">Personen</span>
                </v-flex>
                <v-flex text-xs-right pr-3>
                  {{ nrOfPersons }}
                </v-flex>
              </v-layout>
            </div>
            <v-layout>
              <v-flex mt-3>
                <v-slider
                  v-model="nrOfPersons"
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
              <v-layout class="menu-item">
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
              <v-layout class="menu-item">
                <v-flex xs10>
                  <span class="form-label py-2">Overstappen</span>
                </v-flex>
                <v-flex v-if="transferAllowed" pr-3 text-xs-right>
                  <v-icon>check</v-icon>
                </v-flex>
                <v-flex v-else pr-3 text-xs-right>
                  <v-icon color="red">close</v-icon>
                </v-flex>
              </v-layout>
            </div>
            <v-layout row align-center px-4 wrap>
              <v-flex xs12>
                <v-alert type="warning" value="true" color="orange">
                  Let op: Als overstappen wordt uitgeschakeld is het alleen
                  mogelijk om u te matchen met een directe rit. In veel gevallen
                  zal dit niet mogelijk zijn. Het uitzetten van deze optie zal
                  resulteren in een sterk verminderd aantal reisopties.
                </v-alert>
              </v-flex>
              <v-flex xs10>
                Overstappen
              </v-flex>
              <v-flex>
                <v-switch v-model="transferAllowed" color="green"></v-switch>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header">
              <v-layout class="menu-item">
                <v-flex xs10>
                  <span class="form-label py-2">Toestaan</span>
                </v-flex>
                <v-flex>
                  <v-layout pr-3>
                    <v-flex
                      v-for="travelMode in allowedTravelModes"
                      :key="travelMode.mode"
                    >
                      <v-icon>{{ travelMode.icon }}</v-icon>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
            <v-layout pb-4>
              <v-flex px-4>
                <v-layout row wrap>
                  <v-flex
                    v-for="travelMode in travelModes"
                    :key="travelMode.mode"
                    xs6
                  >
                    <v-checkbox
                      v-model="allowedTravelModes"
                      hide-details
                      :label="travelMode.label"
                      :value="travelMode"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header">
              <v-layout class="menu-item">
                <v-flex xs9>
                  <span class="form-label py-2">Maximale loopafstand</span>
                </v-flex>
                <v-flex text-xs-right pr-3>
                  {{ maxMinutesWalking }} min
                </v-flex>
              </v-layout>
            </div>
            <v-layout>
              <v-flex mt-3>
                <v-slider
                  v-model="maxMinutesWalking"
                  class="px-4"
                  thumb-color="thumb-grey"
                  thumb-label
                  ticks="always"
                  tick-size="2"
                  :tick-labels="generateMinuteRange"
                  min="0"
                  max="30"
                  step="5"
                />
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
import travelModes from '@/constants/travel-modes.js'
import luggageTypes from '@/constants/luggage-types.js'

export default {
  name: 'RidePreferences',
  data: function() {
    return {
      maxNrOfPersons: 4,
      luggageSelected: [],
      allowedTravelModes: [],
      nrOfPersons: 1,
      transferAllowed: true,
      maxMinutesWalking: 0,
    }
  },
  computed: {
    travelModes: function() {
      return travelModes
    },
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
      for (let i = 0; i <= 30; i += 5) {
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
    this.luggageSelected = profile.ridePreferences.luggageOptions.map(option =>
      this.parseLuggageOption(option)
    )
    this.allowedTravelModes = profile.ridePreferences.allowedTravelModes.map(
      mode => this.parseTravelMode(mode)
    )
    this.nrOfPersons = profile.ridePreferences.numPassengers
    this.transferAllowed = profile.ridePreferences.allowTransfer
    this.maxMinutesWalking = profile.ridePreferences.maximumTransferTime
  },
  methods: {
    save: function() {
      let payload = {
        luggageOptions: this.luggageSelected.map(x => x.type),
        allowedTravelModes: this.allowedTravelModes.map(x => x.mode),
        numPassengers: this.nrOfPersons,
        allowTransfer: this.transferAllowed,
        maximumTransferTime: this.maxMinutesWalking,
      }
      this.$store.dispatch('ps/storeRidePreferences', payload)
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
        WALKER: {
          type: 'WALKER',
          label: 'Rollator',
          icon: 'fa-crutch',
        },
        GROCERIES: {
          type: 'GROCERIES',
          label: 'Boodschappen',
          icon: 'fa-shopping-bag',
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

.menu-item {
  height: 25px;
}
</style>
