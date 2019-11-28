<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h3>Auto toevoegen</h3>
      </v-flex>
      <v-divider />
      <v-flex>
        <v-layout align-center my-2>
          <v-flex xs3>
            Kenteken
          </v-flex>
          <v-flex xs9>
            <input
              v-model="searchLicensePlate"
              placeholder="__-___-_"
              class="search-license-plate"
              maxlength="8"
            />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout align-center my-1>
          <v-flex xs3 />
          <v-flex xs9 text-truncate>
            <span v-if="searchResult" class="search-results">
              {{ searchResult.brand }}, {{ searchResult.model }} ({{
                searchResult.registrationYear
              }})
            </span>
            <span v-else>&nbsp;</span>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout align-center my-2>
          <v-flex xs8 />
          <v-flex xs4>
            <v-btn
              :disabled="!searchResult"
              small
              rounded
              block
              @click="continueWithSelectedCar()"
            >
              Verder
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
    continueWithSelectedCar() {
      this.$store.commit(
        'cs/setSearchLicensePlate',
        this.searchLicensePlate.toUpperCase()
      )
      this.$router.push('/profileEditCar')
    },
  },
}
</script>

<style lang="scss">
.search-license-plate {
  text-transform: uppercase;
}
.search-results {
  font-style: italic;
  font-size: 80%;
  color: $color-mid-grey;
}
</style>
