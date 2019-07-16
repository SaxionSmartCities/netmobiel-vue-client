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
              <v-layout>
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
              <v-layout>
                <v-flex xs10>
                  <span class="form-label py-2">Bagage</span>
                </v-flex>
                <v-flex>
                  <v-layout pr-3>
                    <v-flex v-for="luggage in luggageSelected" :key="luggage">
                      <v-icon>{{ luggage }}</v-icon>
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
                    :key="luggage.key"
                    xs6
                  >
                    <v-checkbox
                      v-model="luggageSelected"
                      hide-details
                      :label="luggage.key"
                      :value="luggage.value"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header">
              <v-layout>
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
              <v-layout>
                <v-flex xs10>
                  <span class="form-label py-2">Vermijden</span>
                </v-flex>
                <v-flex>
                  <v-layout pr-3>
                    <v-flex
                      v-for="(travelTypeIcon, index) in avoidTravelTypeIcons"
                      :key="index"
                    >
                      <v-icon>{{ travelTypeIcon }}</v-icon>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>
            <v-layout pb-4>
              <v-flex px-4>
                <v-layout row wrap>
                  <v-flex
                    v-for="travelType in travelTypes"
                    :key="travelType"
                    xs6
                  >
                    <v-checkbox
                      v-model="avoidTravelTypes"
                      hide-details
                      :label="travelType"
                      :value="travelType"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>

          <v-expansion-panel-content>
            <div slot="header">
              <v-layout>
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

  <!-- <v-layout my-4 ml-2 column>
      <v-divider></v-divider>

      <v-flex id="personen" my-3>
        <v-layout align-center>
          <v-flex xs9><span class="form-label py-2">Personen</span></v-flex>
          <v-flex id="incdecvalue">
            <v-layout align-center>
              <v-flex id="dec">
                <v-btn small fab @click="incrementPersons(-1)">-</v-btn>
              </v-flex>
              <v-flex mx-3>
                <span>{{ nrOfPersons }}</span>
              </v-flex>
              <v-flex>
                <v-btn small fab @click="incrementPersons(1)">+</v-btn>
              </v-flex></v-layout
            ></v-flex
          >
        </v-layout>
      </v-flex>
      <v-divider></v-divider>

      <v-flex id="bagage" my-3>
        <v-layout>
          <v-flex xs9><span class="form-label py-2">Bagage</span></v-flex>
          <v-flex> </v-flex>
        </v-layout>
      </v-flex>
      <v-divider></v-divider>

      <v-flex id="overstappen" my-2>
        <v-layout align-center>
          <v-flex xs9><span class="form-label py-2">Overstappen</span></v-flex>
          <v-flex>
            <v-select
              v-model="switchSelected"
              hide-details="true"
              attach
              :items="overstappen"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-divider></v-divider>

      <v-flex id="sorteren" my-3>
        <v-flex xs9><span class="form-label py-2">Sorteren</span></v-flex>
        <v-flex> </v-flex>
      </v-flex>
      <v-divider></v-divider>

      <v-flex id="vermijden" my-3>
        <v-flex xs9><span class="form-label py-2">Vermijden</span></v-flex>
        <v-flex> </v-flex>
      </v-flex>
      <v-divider></v-divider>
    </v-layout> -->

  <!-- <v-layout>
      <v-flex xs11>
        <v-subheader class="font-weight-bold">Personen</v-subheader>
      </v-flex>
      <v-flex>
        <v-btn small fab @click="incrementPersons(-1)">-</v-btn>
      </v-flex>
      <v-flex xs1>
        <v-text-field
          v-model="personen"
          type="number"
          max="10"
          read-only
          value="1"
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-btn small fab @click="incrementPersons(1)">+</v-btn>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout align-center>
      <v-flex>
        <v-subheader class="font-weight-bold">Bagage</v-subheader>
      </v-flex>
      <v-flex xs8 pt-1>
        <v-select
          v-model="bagageSelected"
          :items="bagage"
          attach
          multiple
        ></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout>
      <v-flex>
        <v-subheader class="font-weight-bold">Overstappen</v-subheader>
      </v-flex>
      <v-flex xs8 pt-1>
        <v-select
          v-model="switchSelected"
          attach
          :items="overstappen"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout>
      <v-flex>
        <v-subheader class="font-weight-bold">Sorteren</v-subheader>
      </v-flex>
      <v-flex xs8 pt-1>
        <v-select v-model="sortSelected" attach :items="sorteren"></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout justify-space-between>
      <v-flex>
        <v-subheader class="font-weight-bold">Vermijden</v-subheader>
      </v-flex>
      <v-flex xs8 pt-1>
        <v-select
          v-model="avoidSelected"
          :items="vermijden"
          attach
          multiple
        ></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    -->
</template>

<script>
import { getIcon } from '@/utils/Utils.js'

export default {
  name: 'RidePreferences',
  data: function() {
    return {
      //hardcoded lists, must be changed later
      luggageTypes: [
        { key: 'Buggy', value: 'child_friendly' },
        { key: 'Handbagage', value: 'work' },
        { key: 'Huisdier', value: 'pets' },
        { key: 'Rollator', value: 'fa-crutch' },
        { key: 'Rolstoel', value: 'accessible_forward' },
      ],
      travelTypes: ['WALK', 'CAR', 'NETMOBIEL', 'TRAIN', 'BUS', 'RAIL'],
      avoidTravelTypes: [],

      luggageSelected: [],
      nrOfPersons: 1,
      maxNrOfPersons: 4,
      transferAllowed: true,
      maxMinutesWalking: 0,
    }
  },
  computed: {
    avoidTravelTypeIcons: function() {
      return this.avoidTravelTypes.map(element => getIcon(element))
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
    this.$store.commit('showBackButton')
  },
  mounted() {
    // let prefs = this.$store.getters.getRideSearchPreferences
    // this.passengersSelected = prefs.passengersSelected
    // this.sortSelected = prefs.sortSelected
    // this.switchSelected = prefs.switchSelected
    // for (let i = 0; i < this.bagage.length; i++) {
    //   if (Object.values(prefs.bagagePrefs)[i]) {
    //     this.bagageSelected.push(this.bagage[i])
    //   }
    // }
    // for (let i = 0; i < this.vermijden.length; i++) {
    //   if (Object.values(prefs.avoidSelected)[i]) {
    //     this.avoidSelected.push(this.vermijden[i])
    //   }
    // }
  },
  methods: {
    save: function() {
      this.$store.commit('setRideSearchPreferences', {
        passengersSelected: this.passengersSelected,
        bagagePrefs: {
          buggy: this.bagageSelected.indexOf(this.bagage[0]) > -1,
          handbagage: this.bagageSelected.indexOf(this.bagage[1]) > -1,
          animal: this.bagageSelected.indexOf(this.bagage[2]) > -1,
          walker: this.bagageSelected.indexOf(this.bagage[3]) > -1,
          wheelchair: this.bagageSelected.indexOf(this.bagage[4]) > -1,
        },
        switchSelected: this.switchSelected,
        sortSelected: this.sortSelected,
        avoidSelected: {
          bus: this.avoidSelected.indexOf(this.vermijden[0]) > -1,
          train: this.avoidSelected.indexOf(this.vermijden[1]) > -1,
          walk: this.avoidSelected.indexOf(this.vermijden[2]) > -1,
          bike: this.avoidSelected.indexOf(this.vermijden[3]) > -1,
        },
      })
      this.$router.push('search')
    },
    incrementPersons(i) {
      if (i === 1 && this.personen < 8) {
        this.personen = this.personen + i
      } else if (i === -1 && this.personen > 1)
        this.personen = this.personen + i
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
</style>
