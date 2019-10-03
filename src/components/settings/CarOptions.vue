<template>
  <v-layout column>
    <v-flex>
      <v-layout column pt-3>
        <v-flex>
          <v-layout column>
            <v-flex>
              <v-layout align-center mr-1>
                <v-flex>
                  Kenteken:
                </v-flex>
                <v-flex xs6>
                  <input
                    v-model="searchLicensePlate"
                    placeholder="__-___-_"
                    class="search-license-plate"
                  />
                </v-flex>
                <v-flex xs3>
                  <v-btn
                    :disabled="searchLicensePlate.length !== 8"
                    small
                    round
                    block
                    mb-4
                    @click="addCar(getSearchResult)"
                  >
                    Voeg toe
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout pl-3>
                <span
                  v-if="searchLicensePlate.length == 8"
                  class="search-results"
                >
                  {{ getSearchResult.brand }},&nbsp;
                  {{ getSearchResult.model }}&nbsp;(
                  {{ getSearchResult.registrationYear }}
                  )
                </span>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout column pt-3>
        <v-flex v-for="car in getAvailableCars" :key="car.id">
          <v-divider></v-divider>
          <v-layout column>
            <v-flex>
              <v-layout align-center mr-2 pt-3>
                <v-flex xs3>
                  Kenteken:
                </v-flex>
                <v-flex>
                  {{ car.licensePlate }}
                </v-flex>
                <v-flex xs1>
                  <v-icon @click="removeCar(car)">delete_forever</v-icon>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout pl-3 pb-3>
                <span class="search-results">
                  {{ car.brand }},&nbsp;{{ car.model }}&nbsp;({{
                    car.registrationYear
                  }})
                </span>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'CarOptions',
  data() {
    return {
      searchLicensePlate: '',
    }
  },
  computed: {
    getAvailableCars() {
      const profile = this.$store.getters['ps/getUser'].profile
      console.log(profile)
      return this.$store.getters['ps/getUser'].profile.ridePlanOptions.cars
    },
    getSearchResult() {
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
  methods: {
    removeCar(car) {
      this.$store.commit('ps/deleteRidePlanOptionsCar', car)
      const profile = this.$store.getters['ps/getUser'].profile
      this.$store.dispatch('ps/updateProfile', profile)
    },
    addCar(car) {
      this.$store.commit('ps/addRidePlanOptionsCar', car)
      const profile = this.$store.getters['ps/getUser'].profile
      this.$store.dispatch('ps/updateProfile', profile)
    },
  },
}
</script>

<style scoped lang="scss">
button.remove-btn {
  background-color: red !important;
}

/* HACK: Added important to override vuetify style. Should be fixed. */
.v-btn {
  background-color: white !important;
  color: $color-green !important;
  border: 1px solid $color-green;
}
.search-license-plate {
  text-transform: uppercase;
}
.search-results {
  font-style: italic;
  color: $color-mid-grey;
}
</style>
