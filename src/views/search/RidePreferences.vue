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
          fab
          @click="incrementPersons(-1)"
          id="buttonMinus"
          class="title"
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
          fab
          @click="incrementPersons(1)"
          id="buttonPlus"
          class="title"
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
          v-model="bagageSelected"
          :items="bagage"
          attach
          multiple
        ></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout>
      <v-flex xs6 md4 lg2>
        <v-subheader class="font-weight-bold">Overstappen</v-subheader>
      </v-flex>
      <v-flex xs8 lg10 pt-1>
        <v-select
          v-model="switchSelected"
          attach
          :items="overstappen"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout>
      <v-flex xs6 md4 lg2>
        <v-subheader class="font-weight-bold">Sorteren</v-subheader>
      </v-flex>
      <v-flex xs8 lg10 pt-1>
        <v-select v-model="sortSelected" attach :items="sorteren"></v-select>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>

    <v-layout justify-space-between>
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
    <v-layout mt-5 align-center justify-space-around row>
      <v-btn @click="$router.push('search')">Back</v-btn>
      <v-btn @click="save">Save</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'RidePreferences',
  data: function() {
    return {
      //hardcoded lists, must be changed later
      bagage: ['Buggy', 'Handbagage', 'Huisdier', 'Rollator', 'Rolstoel'],
      overstappen: ['Ja', 'Nee'],
      sorteren: ['Reistijd', 'Prijs', 'Bekenden'],
      vermijden: ['Bus', 'Trein', 'Lopen', 'Fiets'],
      personen: 1,

      //selected
      passengersSelected: 1,
      bagageSelected: [],
      switchSelected: 'Ja',
      sortSelected: 'Bekenden',
      avoidSelected: [],
    }
  },
  mounted() {
    let prefs = this.$store.getters.getRideSearchPreferences
    this.passengersSelected = prefs.passengersSelected
    this.sortSelected = prefs.sortSelected
    this.switchSelected = prefs.switchSelected
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

#buttonMinus {
  background-color: $color-green;
}

#buttonPlus {
  background-color: $color-green;
}

#inputPersons {
  text-align: center;
}
</style>
