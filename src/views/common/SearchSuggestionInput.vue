<template>
  <v-layout>
    <v-flex>
      <v-layout>
        <v-text-field
          v-model="searchInput"
          clearable
          placeholder="Zoek..."
          class="border-radius-input"
          single-line
          @click:clear="clearSearchInput"
        ></v-text-field>
      </v-layout>
      <v-layout>
        <v-flex xs12>
          <v-list v-if="showSuggestionsList" pt-0>
            <template v-for="(location, index) in locations">
              <v-list-tile
                :key="location.name"
                @click="completeSearch(location)"
              >
                <v-icon class="mr-3">{{ location.type }}</v-icon>
                <v-list-tile-content class="grey--text">
                  <v-list-tile-title>
                    <div v-html="location.label"></div>
                  </v-list-tile-title>
                  <v-list-tile-sub-title></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-if="index + 1 < locations.length" :key="index">
              </v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'SearchSuggestionInput',
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
  },
  methods: {
    completeSearch(location) {
      this.$store.dispatch('fetchGeocoderLocation', location.locationId)
      this.$emit('pickedLocation', location)
    },
    clearSearchInput() {
      this.searchInput = ''
      this.showSuggestionsList = false
    },
  },
}
</script>

<style scoped></style>
