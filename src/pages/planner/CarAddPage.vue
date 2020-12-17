<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Auto toevoegen</h3>
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
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="pb-0">
        <em>Merk:</em>
      </v-col>
      <v-col class="pb-0">
        <span v-if="searchResult" class="search-results">
          {{ searchResult.brand }}
        </span>
        <span v-else>-</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="pb-0">
        <em>Model:</em>
      </v-col>
      <v-col class="pb-0">
        <span v-if="searchResult" class="search-results">
          {{ searchResult.model }}
        </span>
        <span v-else>-</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="pb-5">
        <em>Bouwjaar:</em>
      </v-col>
      <v-col class="pb-5">
        <span v-if="searchResult" class="search-results">
          {{ searchResult.registrationYear }}
        </span>
        <span v-else>-</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          :disabled="!searchResult"
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
  data: function() {
    return {
      searchLicensePlate: '',
    }
  },
  computed: {
    searchResult() {
      return csStore.getters.getSearchResult
    },
  },
  watch: {
    searchLicensePlate(newValue) {
      if (newValue.length == 8) {
        csStore.actions.fetchLicense(newValue)
      } else {
        csStore.mutations.clearSearchResult()
      }
    },
  },
  mounted() {
    csStore.mutations.clearSearchResult()
  },
  created: function() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    addCar(car) {
      const cars = csStore.getters.getAvailableCars

      let storedCar = cars.find(c => c.licensePlate === car.licensePlate)
      if (storedCar) {
        uiStore.actions.queueErrorNotification(
          'Auto is al opgeslagen aan uw profiel.'
        )
      } else {
        csStore.actions.submitCar(car).then(() => {
          csStore.actions.fetchCars()
          this.$router.go(-1)
        })
      }
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
