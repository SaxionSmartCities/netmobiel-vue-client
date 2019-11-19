<template>
  <v-layout>
    <v-flex>
      <v-layout>
        <v-text-field
          v-model="searchInput"
          autofocus
          clearable
          placeholder="Zoek..."
          prepend-inner-icon="search"
          class="border-radius-input"
          outline
          single-line
          @click:clear="clearSearchInput"
        ></v-text-field>
      </v-layout>
      <v-layout>
        <v-flex xs12>
          <v-list v-if="showSuggestionsList" pt-0>
            <template v-for="(suggestion, index) in suggestions">
              <v-list-tile
                :key="suggestion.name"
                @click="completeSearch(suggestion)"
              >
                <v-icon class="mr-3">
                  {{ iconicCategory(suggestion.category) }}
                </v-icon>
                <v-list-tile-content class="grey--text">
                  <v-list-tile-title>
                    <div v-html="parseHighlightedLabel(suggestion)"></div>
                  </v-list-tile-title>
                  <v-list-tile-sub-title></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < suggestions.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
// map category to Material icon name (needs more work...)
const categoryIcons = {
  airport: 'local_airport',
  'city-town-village': 'location_city',
  hotel: 'local_hotel',
  'railway-station': 'train',
  restaurant: 'restaurant',
  'sights-museums': 'museum',
  'sports-facility-venue': 'sports',
  'taxi-stand': 'local_taxi',
  'theatre-music-culture': 'theaters',
}
// show at most 8 suitable suggestions
const highlightMarker = 'class="search-hit"'
const skipCategories = new Set(['intersection'])
const maxSuggestions = 8
function improveSuggestions(suggestions) {
  const highlighted = suggestions.filter(
    suggestion =>
      suggestion.highlightedTitle.indexOf(highlightMarker) > 0 &&
      !skipCategories.has(suggestion.category)
  )
  highlighted.length = Math.min(highlighted.length, maxSuggestions)
  return highlighted
}

export default {
  name: 'SearchSuggestionInput',
  data() {
    return {
      searchInput: '',
      showSuggestionsList: false,
    }
  },
  computed: {
    suggestions() {
      return improveSuggestions(
        this.$store.getters['gs/getGeocoderSuggestions']
      )
    },
  },
  watch: {
    searchInput: function(val) {
      const show = (this.showSuggestionsList = val.length > 3)
      if (show) {
        this.$store.dispatch('gs/fetchGeocoderSuggestions', {
          place: val,
          // geographic center of the Netherlands (near Lunteren)
          area: '52.063045,5.349972;r=150000',
          result_types: 'place,address',
          // highlight the search text
          hlStart: `<span ${highlightMarker}>`,
          hlEnd: '</span>',
        })
      }
    },
  },
  methods: {
    parseHighlightedLabel(suggestion) {
      return `${suggestion.highlightedTitle} ${suggestion.highlightedVicinity}`
    },
    completeSearch(suggestion) {
      this.$store.commit('gs/setGeoLocationPicked', {
        field: this.$route.params.field,
        suggestion: {
          ...suggestion,
          vicinity: suggestion.vicinity.replace('<br/>', ' '),
        },
      })
      this.$router.go(-1)
    },
    clearSearchInput() {
      this.searchInput = ''
      this.showSuggestionsList = false
    },
    iconicCategory(category) {
      return categoryIcons[category] || ''
    },
  },
}
</script>

<style lang="scss">
.search-hit {
  font-weight: bold;
  font-size: 110%;
}
</style>
