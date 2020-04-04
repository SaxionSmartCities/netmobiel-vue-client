<template>
  <content-pane>
    <template v-slot:header>
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
    </template>

    <v-row v-if="showSuggestionsList" class="align-self-start">
      <locations-list
        :locations="suggestions"
        show-highlighted-text
        @onItemClicked="completeSearch"
        @onFavoriteClicked="promptFavorite"
        @onUnFavoriteClicked="removeFavorite"
      />
    </v-row>
    <v-row v-if="favorites.length > 0" class="align-self-start" dense>
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
            :show-highlighted-text="false"
            @onItemClicked="completeSearch($event)"
            @onUnFavoriteClicked="removeFavorite"
          />
        </v-row>
      </v-col>
    </v-row>
    <add-favorite-dialog
      v-if="selectedLocation"
      :location="selectedLocation"
      @onAddFavorite="addFavorite"
    />
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import LocationsList from '@/components/search/LocationsList.vue'
import AddFavoriteDialog from '@/components/search/AddFavoriteDialog.vue'

// map category to Material icon name (needs more work...)
// show at most 8 suitable suggestions
import { throttle } from 'lodash'
const highlightMarker = 'class="search-hit"'
const skipCategories = new Set(['intersection'])
const maxSuggestions = 8

export default {
  name: 'SearchLocationPage',
  components: {
    ContentPane,
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
      return this.$store.getters['ps/getProfile'].favoriteLocations
    },
    suggestions() {
      let suggestions = this.$store.getters['gs/getGeocoderSuggestions']
      const highlighted = suggestions.filter(
        suggestion =>
          suggestion.highlightedTitle.indexOf(highlightMarker) > 0 &&
          !skipCategories.has(suggestion.category)
      )
      highlighted.length = Math.min(highlighted.length, maxSuggestions)
      const favorited = highlighted.map(suggestion => ({
        ...suggestion,
        favorite: !!this.favorites.find(fav => fav.id === suggestion.id),
      }))
      return favorited
    },
  },
  watch: {
    searchInput: throttle(function(val) {
      if (val != null) {
        const show = (this.showSuggestionsList = val.length > 3)
        if (show) {
          this.$store.dispatch('gs/fetchGeocoderSuggestions', {
            query: val,
            // geographic center of the Netherlands (near Lunteren)
            area: '52.063045,5.349972',
            result_types: 'place,address',
            // highlight the search text
            hlStart: `<span ${highlightMarker}>`,
            hlEnd: '</span>',
          })
        }
      }
    }, 500),
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
    addFavorite(favorite) {
      let profile = this.$store.getters['ps/getProfile']
      let duplicate = profile.favoriteLocations.find(
        x => x.label === favorite.label
      )
      if (duplicate) {
        //TODO: Check why this does not fire.
        this.$store.dispatch('ui/queueNotification', {
          message: 'Favoriet is al opgeslagen aan uw profiel.',
          timeout: 3000,
        })
      } else {
        let favoriteLocations = profile.favoriteLocations.slice(0)
        favoriteLocations.push(favorite)
        this.$store.dispatch('ps/storeFavoriteLocations', favoriteLocations)
      }
      this.selectedLocation = undefined
    },
    removeFavorite(favorite) {
      let profile = this.$store.getters['ps/getProfile']
      let favoriteLocations = profile.favoriteLocations.filter(
        x => x.id !== favorite.id
      )
      this.$store.dispatch('ps/storeFavoriteLocations', favoriteLocations)
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
