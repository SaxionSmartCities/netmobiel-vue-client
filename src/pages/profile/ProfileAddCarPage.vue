<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h3>Auto toevoegen</h3>
      </v-flex>
      <v-divider />
      <v-flex>
        <v-layout align-center my-2>
          <v-flex xs7>
            Voer het kenteken in:
          </v-flex>
          <v-flex xs2>
            <input
              v-model="searchLicensePlate"
              placeholder="__-___-_"
              class="search-license-plate"
              maxlength="8"
            />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex pl-2>
        <v-layout align-center my-1>
          <v-flex xs4 font-italic>
            Merk:
          </v-flex>
          <v-flex xs8 text-truncate font-weight-medium>
            <span v-if="searchResult" class="search-results">
              {{ searchResult.brand }}
            </span>
            <span v-else>-</span>
          </v-flex>
        </v-layout>
        <v-layout align-center my-1>
          <v-flex xs4 font-italic>
            Model:
          </v-flex>
          <v-flex xs8 text-truncate font-weight-medium>
            <span v-if="searchResult" class="search-results">
              {{ searchResult.model }}
            </span>
            <span v-else>-</span>
          </v-flex>
        </v-layout>
        <v-layout align-center my-1>
          <v-flex xs4 font-italic>
            Bouwjaar:
          </v-flex>
          <v-flex xs8 text-truncate font-weight-medium>
            <span v-if="searchResult" class="search-results">
              {{ searchResult.registrationYear }}
            </span>
            <span v-else>-</span>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout align-center my-2>
          <v-flex xs8 />
          <v-flex xs5>
            <v-btn
              :disabled="!searchResult"
              small
              rounded
              block
              depressed
              class="button"
              @click="addCar(searchResult)"
            >
              Toevoegen
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'ProfileAddCar',
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
  width: 90px;
}
</style>
