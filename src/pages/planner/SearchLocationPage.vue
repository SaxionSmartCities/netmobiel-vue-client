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
    <v-row
      v-if="favorites.length > 0 && !showSuggestionsList"
      class="d-flex flex-column align-self-start"
      dense
    >
      <v-col><h4 class="netmobiel">Mijn favorieten</h4></v-col>
      <locations-list
        :locations="favorites"
        :show-highlighted-text="false"
        @onItemClicked="completeSearch($event)"
        @onUnFavoriteClicked="removeFavorite"
      />
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
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'
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
  props: {
    editSearchCriteria: {
      type: String,
      default: 'false',
      required: false,
    },
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
      return psStore.getters.getProfile.favoriteLocations
    },
    suggestions() {
      let suggestions = gsStore.getters.getGeocoderSuggestions
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
    localEditSearchCriteria() {
      return this.editSearchCriteria === 'true'
    },
  },
  watch: {
    searchInput: throttle(function(val) {
      if (val != null) {
        const show = (this.showSuggestionsList = val.length > 3)
        if (show) {
          gsStore.actions.fetchGeocoderSuggestions({
            query: val,
            hlStart: `<span ${highlightMarker}>`,
            hlEnd: '</span>',
          })
        }
      }
    }, 500),
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    parseHighlightedLabel(suggestion) {
      return `${suggestion.highlightedTitle} ${suggestion.highlightedVicinity}`
    },
    completeSearch(suggestion) {
      if (this.localEditSearchCriteria) {
        const vicinity = suggestion?.vicinity.replace('<br/>', ' ')
        const fieldValue = {
          label: `${suggestion.title} ${vicinity || ''}`,
          latitude: suggestion.position[0],
          longitude: suggestion.position[1],
        }

        this.$store.commit('is/setSearchCriteriaField', {
          field: this.$route.params.field,
          value: fieldValue,
        })
        this.sendPlanningRequest()
      } else {
        gsStore.mutations.setGeoLocationPicked({
          field: this.$route.params.field,
          suggestion: {
            ...suggestion,
            vicinity: suggestion.vicinity.replace('<br/>', ' '),
          },
        })
      }
      this.$router.go(-1)
    },
    sendPlanningRequest() {
      const searchCriteria = this.$store.getters['is/getSearchCriteria']
      const preferences = this.$store.getters['is/getPlanningRequest']
        ?.preferences
      const { from, to, travelTime } = searchCriteria
      this.$store.dispatch('is/submitPlanningsRequest', {
        from,
        to,
        travelTime,
        preferences: preferences,
      })
    },
    clearSearchInput() {
      this.searchInput = ''
      this.showSuggestionsList = false
    },
    promptFavorite(suggestion) {
      this.selectedLocation = suggestion
    },
    addFavorite(favorite) {
      let profile = psStore.getters.getProfile
      let duplicate = profile.favoriteLocations.find(
        x => x.label === favorite.label
      )
      if (duplicate) {
        //TODO: Check why this does not fire.
        uiStore.actions.queueNotification({
          message: 'Favoriet is al opgeslagen aan uw profiel.',
          timeout: 3000,
        })
      } else {
        let favoriteLocations = profile.favoriteLocations.slice(0)
        favoriteLocations.push(favorite)
        psStore.actions.storeFavoriteLocations(favoriteLocations)
      }
      this.selectedLocation = undefined
    },
    removeFavorite(favorite) {
      let profile = psStore.getters.getProfile
      let favoriteLocations = profile.favoriteLocations.filter(
        x => x.id !== favorite.id
      )
      psStore.actions.storeFavoriteLocations(favoriteLocations)
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
