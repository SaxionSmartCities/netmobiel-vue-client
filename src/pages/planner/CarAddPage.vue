<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Auto toevoegen</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" class="d-flex flex-column justify-center">
        <span class="title font-weight-light">Voer het kenteken in:</span>
        <span class="caption font-weight-light ml-1">
          Vul zelf de middenstreepjes in
        </span>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="searchLicensePlate"
          dense
          :hide-details="true"
          outlined
          placeholder="XX-XX-XX"
          class="search-license-plate"
          maxlength="8"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4"> Merk: </v-col>
      <v-col>{{ searchResult.brand }}</v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4"> Model: </v-col>
      <v-col>{{ searchResult.model }}</v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4"> Bouwjaar: </v-col>
      <v-col>{{ searchResult.registrationYear }}</v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4"> # Stoelen: </v-col>
      <v-col>{{ searchResult.nrSeats }}</v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4"> # Deuren: </v-col>
      <v-col>{{ searchResult.nrDoors }}</v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">CO2 (gr/km):</v-col>
      <v-col>{{ searchResult.co2Emission }}</v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          :disabled="!searchResult.licensePlate"
          rounded
          large
          block
          depressed
          class="button"
          @click="addCar(searchResult)"
        >
          Voeg deze auto toe
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'ProfileAddCar',
  components: {
    ContentPane,
  },
  data: function () {
    return {
      searchLicensePlate: '',
    }
  },
  computed: {
    searchResult() {
      return csStore.getters.getCarSearchResult ?? {}
    },
  },
  watch: {
    searchLicensePlate(newValue) {
      if (newValue.length === 8) {
        csStore.actions.lookupCarByLicensePlate(newValue)
      } else {
        csStore.mutations.clearCarSearchResult()
      }
    },
  },
  mounted() {
    csStore.mutations.clearCarSearchResult()
  },
  created: function () {
    uiStore.mutations.showBackButton()
  },
  methods: {
    addCar(car) {
      csStore.actions
        .createCarForMe(car)
        .then(() => {
          this.$router.go(-1)
        })
        .catch(() => {
          // Error message already queued
        })
    },
  },
}
</script>

<style lang="scss">
.search-license-plate {
  text-transform: uppercase;
  width: 130px;
}
</style>
