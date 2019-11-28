<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
          v-model="searchInput"
          autofocus
          clearable
          outlined
          placeholder="Zoek..."
          prepend-inner-icon="search"
          outline
          single-line
          hide-details
          @click:clear="clearSearchInput"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="showSuggestionsList">
      <v-list max-width="100%">
        <v-list-item-group>
          <template v-for="(suggestion, index) in suggestions">
            <location-list-item
              :key="suggestion.id"
              :suggestion="suggestion"
              show-favorite-button
              @onItemClicked="completeSearch(suggestion)"
              @onFavoriteClicked="toggleFavorite(suggestion)"
            />
            <v-divider v-if="index + 1 < suggestions.length" :key="index" />
          </template>
        </v-list-item-group>
      </v-list>
    </v-row>
    <v-row v-else dense>
      <v-col>
        <v-row>
          <v-col>
            <span class="text-uppercase text-color-primary">
              Mijn favorieten
            </span>
          </v-col>
        </v-row>
        <v-row> <v-col> </v-col> </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LocationListItem from '@/components/search/LocationListItem.vue'
// map category to Material icon name (needs more work...)
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
  components: {
    LocationListItem,
  },
  data() {
    return {
      searchInput: '',
      showSuggestionsList: false,
      favorites: [{}],
    }
  },
  computed: {
    suggestions() {
      this.$store.getters['gs/getGeocoderSuggestions']
      return improveSuggestions(
        this.$store.getters['gs/getGeocoderSuggestions']
      )
    },
  },
  watch: {
    searchInput: function(val) {
      if (val != null) {
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
      }
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
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
    toggleFavorite(suggestion) {
      console.log('This should become a favorite!', suggestion)
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
