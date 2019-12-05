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
      <locations-list
        :locations="suggestions"
        show-favorite-button
        show-highlighted-text
        @onItemClicked="completeSearch($event)"
        @onFavoriteClicked="promptFavorite($event)"
      />
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
        <v-row>
          <locations-list
            :locations="favorites"
            @onItemClicked="completeSearch($event)"
          />
        </v-row>
      </v-col>
    </v-row>
    <add-favorite-dialog
      v-if="selectedLocation !== undefined"
      :location="selectedLocation"
      @favoriteConfirmed="addFavorite($event)"
    />
  </v-container>
</template>

<script>
import LocationsList from '@/components/search/LocationsList.vue'
import AddFavoriteDialog from '@/components/search/AddFavoriteDialog.vue'

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
    LocationsList,
    AddFavoriteDialog,
  },
  data() {
    return {
      searchInput: '',
      showSuggestionsList: false,
      selectedLocation: undefined,
    }
  },
  computed: {
    favorites() {
      return this.$store.getters['ps/getUser'].favoriteLocations
    },
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
    promptFavorite(suggestion) {
      this.selectedLocation = suggestion
    },
    addFavorite(location) {
      this.$store.commit('ps/addFavorite', location)
      this.selectedLocation = undefined

      this.clearSearchInput()
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
