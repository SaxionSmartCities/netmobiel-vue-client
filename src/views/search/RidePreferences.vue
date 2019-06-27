<template>
  <v-container data-app>
    <v-subheader class="headline">Reisvoorkeuren</v-subheader>
    <v-divider></v-divider>
    <v-layout align-center>
      <v-flex xs11>
        <v-subheader class="font-weight-bold">Personen</v-subheader>
      </v-flex>
      <v-flex>
        <v-btn
          small
          flat=""
          fab
          @click="incrementPersons(-1)"
          id="buttonMinus"
          class="blue-white-button"
          >-</v-btn
        >
      </v-flex>
      <v-flex xs2 md1 lg1 xl1 class="mt-2">
        <v-text-field
          class="mx-2"
          id="inputPersons"
          v-model="personen"
          type="number"
          max="10"
          read-only
          value="1"
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-btn
          small
          flat
          fab
          @click="incrementPersons(1)"
          id="buttonPlus"
          class="blue-white-button"
          >+</v-btn
        >
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout align-center>
      <v-flex xs6 md4 lg2>
        <v-subheader class="font-weight-bold">Bagage</v-subheader>
      </v-flex>
      <v-flex xs8 lg10 pt-1>
        <v-select
          class="testBorder"
          v-model="bagageSelected"
          :items="bagage"
          attach
          multiple
        ></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout align-center>
      <v-flex xs6 md4 lg2>
        <v-subheader class="font-weight-bold">Sorteren</v-subheader>
      </v-flex>
      <v-flex xs8 lg10 pt-1>
        <v-select v-model="sortSelected" attach :items="sorteren"></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout align-center justify-space-between>
      <v-flex xs6 md4 lg2>
        <v-subheader class="font-weight-bold">Vermijden</v-subheader>
      </v-flex>
      <v-flex xs8 lg10 pt-1>
        <v-select
          v-model="avoidSelected"
          :items="vermijden"
          attach
          multiple
        ></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout align-center justify-space-between>
      <v-flex shrink>
        <v-subheader class="font-weight-bold">Overstappen</v-subheader>
      </v-flex>
      <v-flex shrink>
        <v-switch
          :value="switchTransfer"
          color="#2E8997"
          @change="setTransferChange()"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout justify-space-between>
      <v-flex xs8 md4 lg2>
        <v-subheader class="font-weight-bold">Ruimer zoeken</v-subheader>
      </v-flex>
      <v-flex xs4 lg10 pt-1>
        <v-select v-model="widerSearch" :items="ruimerZoeken" attach></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout justify-space-between>
      <v-flex xs8 md4 lg2>
        <v-subheader class="font-weight-bold">Maximale loopafstand</v-subheader>
      </v-flex>
      <v-flex xs4 lg10 pt-1>
        <v-select v-model="maxWalk" :items="maxLoop" attach></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout my-4 align-center justify-space-around row>
      <v-btn class="blue-white-button" @click="$router.push('search')"
        >Back</v-btn
      >
      <v-btn class="blue-white-button" @click="save">Save</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'RidePreferences',
  data: function() {
    return {
      //hardcoded lists, must be changed later
      personen: 1,
      bagage: ['Buggy', 'Handbagage', 'Huisdier', 'Rollator', 'Rolstoel'],
      sorteren: ['Reistijd', 'Prijs', 'Bekenden'],
      vermijden: ['Bus', 'Trein', 'Lopen', 'Fiets'],
      switchTransfer: false,
      ruimerZoeken: ['1 uur', '2 uur', '3 uur', '4 uur', '5 uur'],
      maxLoop: ['5 min.', '10 min.', '15 min.', '20 min.'],

      //selected
      passengersSelected: 1,
      bagageSelected: [],
      sortSelected: 'Bekenden',
      avoidSelected: [],
      widerSearch: '0',
      maxWalk: '0',
    }
  },
  mounted() {
    let prefs = this.$store.getters.getRideSearchPreferences
    this.passengersSelected = prefs.passengersSelected
    this.sortSelected = prefs.sortSelected
    this.switchTransfer = prefs.switchTransfer
    this.widerSearch = prefs.widerSearch
    this.maxWalk = prefs.maxWalk
    for (let i = 0; i < this.bagage.length; i++) {
      if (Object.values(prefs.bagagePrefs)[i]) {
        this.bagageSelected.push(this.bagage[i])
      }
    }
    for (let i = 0; i < this.vermijden.length; i++) {
      if (Object.values(prefs.avoidSelected)[i]) {
        this.avoidSelected.push(this.vermijden[i])
      }
    }
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
        sortSelected: this.sortSelected,
        avoidSelected: {
          bus: this.avoidSelected.indexOf(this.vermijden[0]) > -1,
          train: this.avoidSelected.indexOf(this.vermijden[1]) > -1,
          walk: this.avoidSelected.indexOf(this.vermijden[2]) > -1,
          bike: this.avoidSelected.indexOf(this.vermijden[3]) > -1,
        },
        switchTransfer: this.switchTransfer,
        switchSelected: this.switchSelected,
        widerSearch: this.widerSearch,
        maxWalk: this.maxWalk,
      })
      this.$router.push('search')
    },
    incrementPersons(i) {
      if (i === 1 && this.personen < 8) {
        this.personen = this.personen + i
      } else if (i === -1 && this.personen > 1)
        this.personen = this.personen + i
    },
    setTransferChange() {
      if (this.switchTransfer === false) {
        this.switchTransfer = true
      } else {
        this.switchTransfer = false
      }
    },
  },
}
</script>

<style lang="scss">
.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}

#buttonPlus {
  height: 35px !important;
  width: 35px !important;
}

#buttonMinus {
  height: 35px !important;
  width: 35px !important;
}

#inputPersons {
  text-align: center;
}
</style>
