<template>
  <v-layout>
    <v-flex>
      <v-layout>
        <v-text-field
          v-model="searchInput"
          clearable
          placeholder="Zoek..."
          prepend-inner-icon="search"
          class="border-radius-input"
          outline
          single-line
          @click:clear="clearSearchInput"
        >
        </v-text-field>
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
                    <div v-html="parseLabel(location.label)"></div>
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
    parseLabel(label) {
      let splitLabel = label.split(',').reverse()
      let result = splitLabel[0]

      for (let i = 1; i < splitLabel.length; i++) {
        result += ', ' + splitLabel[i]
      }

      return result
    },
    completeSearch(location) {
      this.$store.dispatch('fetchGeocoderLocation', {
        locationId: location.locationId,
        field: this.$route.params.field,
      })
      this.$router.go(-1)
    },
    clearSearchInput() {
      this.searchInput = ''
      this.showSuggestionsList = false
    },
  },
}
</script>

<style scoped></style>
