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
        empty-list-label="Geen resultaten gevonden"
        show-highlighted-text
        @onItemClicked="completeSearch"
        @onFavoriteClicked="promptFavorite"
        @onUnFavoriteClicked="removeFavorite"
      />
    </v-row>
    <v-row
      v-if="!showSuggestionsList"
      class="d-flex flex-column align-self-start"
      dense
    >
      <v-col v-if="homeAddress.length > 0">
        <h4 class="netmobiel">Thuis</h4>
      </v-col>
      <locations-list
        :locations="homeAddress"
        :show-highlighted-text="false"
        :show-favorite-icon="false"
        empty-list-label="Geen thuis adres"
        @onItemClicked="completeSearch($event)"
        @onUnFavoriteClicked="removeFavorite"
      />
      <v-col class="mt-2">
        <h4 class="netmobiel">Mijn favorieten</h4>
      </v-col>
      <locations-list
        :locations="favorites"
        :show-highlighted-text="false"
        empty-list-label="Geen favorieten opgeslagen"
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
import LocationsList from '@/components/lists/LocationsList.vue'
import AddFavoriteDialog from '@/components/search/AddFavoriteDialog.vue'
// map category to Material icon name (needs more work...)
// show at most 8 suitable suggestions
import { throttle } from 'lodash'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import * as gsStore from '@/store/geocoder-service'
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
    homeAddress() {
      const address = psStore.getters.getProfile.address
      if (address) {
        return [
          {
            ...address,
            label: 'Thuis',
            address: {
              label: `${address.street}, ${address.postalCode} ${address.locality}`,
            },
          },
        ]
      }
      return []
    },
    favorites() {
      return psStore.getters.getProfile.favoriteLocations.map(p => {
        let mapped = { ...p }
        mapped.address = { label: `${p.street}, ${p.postalCode} ${p.locality}` }
        mapped.favorite = true
        return mapped
      })
    },
    suggestions() {
      let suggestions = gsStore.getters.getGeocoderSuggestions
      // Mark suggestion that have already been favorited.
      return suggestions.map(suggestion => ({
        ...suggestion,
        favorite: !!this.favorites.find(fav => fav.id === suggestion.id),
      }))
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
          gsStore.actions.fetchGeocoderSuggestions({ query: val })
        }
      }
    }, 500),
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    psStore.actions.fetchFavoriteLocations()
  },
  methods: {
    parseHighlightedLabel(suggestion) {
      return `${suggestion.highlightedTitle} ${suggestion.highlightedVicinity}`
    },
    completeSearch(suggestion) {
      console.log(`TODO: ${suggestion}`)
      // if (this.localEditSearchCriteria) {
      //   const vicinity = suggestion?.vicinity.replaceAll('<br/>', ' ')
      //   const fieldValue = {
      //     label: `${suggestion.title} ${vicinity || ''}`,
      //     latitude: suggestion.position[0],
      //     longitude: suggestion.position[1],
      //   }
      //   isStore.mutations.setSearchCriteriaField({
      //     field: this.$route.params.field,
      //     value: fieldValue,
      //   })
      //   this.sendPlanningRequest()
      // } else {
      //   gsStore.mutations.setGeoLocationPicked({
      //     field: this.$route.params.field,
      //     suggestion: {
      //       ...suggestion,
      //       vicinity: suggestion.vicinity.replaceAll('<br/>', ' '),
      //     },
      //   })
      // }
      this.$router.go(-1)
    },
    sendPlanningRequest() {
      const searchCriteria = isStore.getters.getSearchCriteria
      const preferences = isStore.getters.getPlanningRequest?.preferences
      const { from, to, travelTime } = searchCriteria
      isStore.actions.submitPlanningsRequest({
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
      let place = { ...favorite.address }
      place.location = {
        coordinates: [favorite.position.longitude, favorite.position.latitude],
        type: 'Point',
      }
      place.ref = favorite.id
      // Overwrite the address label with the label provide by the user.
      place.label = favorite.title

      const profile = psStore.getters.getProfile
      // let duplicate = profile.favoriteLocations.find(
      //   x => x.label === favorite.label
      // )
      // TODO: Check for duplicates
      // if (duplicate) {
      //   //TODO: Check why this does not fire.
      //   uiStore.actions.queueInfoNotification(
      //     'Favoriet is al opgeslagen aan uw profiel.'
      //   )
      // } else {
      const profileId = profile.id
      psStore.actions.storeFavoriteLocation({ profileId, place })
    },
    removeFavorite(favorite) {
      let profileId = psStore.getters.getProfile.id
      const placeId = favorite.id
      psStore.actions.deleteFavoriteLocation({ profileId, placeId })
    },
  },
}
</script>

<style lang="scss"></style>
