<template>
  <v-container fluid>
    <search-suggestion-input></search-suggestion-input>
  </v-container>
</template>

<script>
import SearchSuggestionInput from '../common/SearchSuggestionInput'
export default {
  name: 'SearchLocation',
  components: { SearchSuggestionInput },
  data() {
    return {
      searchInput: '',
      showSuggestionsList: false,
    }
  },
  computed: {
    locations() {
      return this.$store.getters.getGeocoderSuggestions
    },
    getGeocoderPickedLocations() {
      return this.$store.getters.getGeocoderPickedLocations
    },
  },
  watch: {
    searchInput: function(val) {
      if (val) {
        if (val.length > 3) {
          this.showSuggestionsList = true
          this.$store.dispatch('fetchGeocoderSuggestions', val)
        }
      }
    },
    getGeocoderPickedLocations: function() {
      this.$router.go(-1)
    },
  },
  mounted: function() {
    this.$store.commit('showBackButton')
  },
  methods: {
    completeSearch(location) {
      this.$store.dispatch('fetchGeocoderLocation', location.locationId)
      // this.$router.go(-1)
    },
    clearSearchInput() {
      this.searchInput = ''
      this.showSuggestionsList = false
    },
  },
}
</script>

<style lang="scss">
.border-radius-input > .v-input__control > .v-input__slot {
  border-radius: $form-border-radius-input;
}
</style>
