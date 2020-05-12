<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Auto toevoegen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7" class="d-flex flex-row align-center">
        <span class="title font-weight-light">Voer het kenteken in:</span>
      </v-col>
      <v-col>
        <v-text-field
          v-model="searchLicensePlate"
          dense
          :hide-details="true"
          outlined
          placeholder="XX-XXX-XX"
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
      return this.$store.getters['cs/getSearchResult']
    },
  },
  watch: {
    searchLicensePlate(newValue) {
      if (newValue.length == 8) {
        this.$store.dispatch('cs/fetchLicense', newValue)
      } else {
        this.$store.commit('cs/clearSearchResult')
      }
    },
  },
  mounted() {
    this.$store.commit('cs/clearSearchResult')
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    addCar(car) {
      const cars = this.$store.getters['cs/getAvailableCars']
      let storedCar = cars.find(c => c.licensePlate === car.licensePlate)
      if (storedCar) {
        this.$store.dispatch('ui/queueNotification', {
          message: 'Auto is al opgeslagen aan uw profiel.',
          timeout: 0,
        })
      } else {
        this.$store.dispatch('cs/submitCar', car).then(() => {
          this.$store.dispatch('cs/fetchCars')
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
