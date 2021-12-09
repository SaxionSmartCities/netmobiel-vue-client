<template>
  <content-pane>
    <template #header>
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
      <!--      <v-col v-if="homeAddress.length > 0">-->
      <!--        <h4 class="netmobiel">Thuis</h4>-->
      <!--      </v-col>-->
      <locations-list
        :locations="homeAddress"
        :show-highlighted-text="false"
        :show-favorite-icon="false"
        empty-list-label="Geef je thuisadres op in je profiel"
        @onItemClicked="completeSearch($event)"
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
      :show="selectedLocation != null"
      :location="selectedLocation"
      :initial-name="searchInput"
      @onCancelFavorite="cancelFavorite"
      @onAddFavorite="addFavorite"
    />
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import LocationsList from '@/components/lists/LocationsList.vue'
import AddFavoriteDialog from '@/components/search/AddFavoriteDialog.vue'
import { throttle } from 'lodash'
import {
  geoPlaceToAddressLabel,
  geoPlaceToCriteria,
  geoSuggestionToPlace,
} from '@/utils/Utils'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import * as gsStore from '@/store/geocoder-service'
import constants from '@/constants/constants'
// map category to Material icon name (needs more work...)
// show at most 8 suitable suggestions
// const skipCategories = new Set(['intersection'])
// const maxSuggestions = 8

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
      selectedLocation: null,
    }
  },
  computed: {
    homeAddress() {
      const address = psStore.getters.getProfile.address
      if (address?.location?.coordinates) {
        return [
          {
            ...address,
            title: 'Thuis',
            subtitle: geoPlaceToAddressLabel(address, false),
            iconName: 'home',
          },
        ]
      }
      return []
    },
    favorites() {
      return psStore.getters.getProfile.favoriteLocations.map((place) => {
        return {
          ...place,
          title: place.name,
          subtitle: geoPlaceToAddressLabel(place, true),
          favorite: true,
          iconName: this.iconicCategory(place.category),
        }
      })
    },
    suggestions() {
      return gsStore.getters.getGeocoderSuggestions.map((suggestion) =>
        this.createLocationFromSuggestion(suggestion)
      )
    },
    localEditSearchCriteria() {
      return this.editSearchCriteria === 'true'
    },
  },
  watch: {
    searchInput: throttle(function (val) {
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
    gsStore.mutations.setGeocoderSuggestions([])
    this.searchInput = gsStore.getters.getPickedLocations.get(
      this.$route.params.field
    )?.query
  },
  methods: {
    createLocationFromSuggestion(sug) {
      // A location is an extended Place.
      // It has a title as suggested by the geo service.
      // It has a subtitle, something shown at the second line.
      // It has titleParts, a list of objects comprising a text and a highlight flag.
      // It has a flag indicating whether the entry is a favorite (stored in the profile).
      // It has an iconName, associated with the category of the location
      let loc = {
        ...geoSuggestionToPlace(sug),
        favorite: !!this.favorites.find((fav) => fav.ref === sug.id),
        titleParts: [],
        title: sug.title.replace(', Nederland', ''),
        subtitle: '',
        iconName: this.iconicCategory(sug.category),
      }
      let prevTitleIx = 0
      // Base the loc.titleParts on the possibly modified loc.title
      for (let ix = 0; ix < sug.titleHighlights?.length; ix++) {
        let thl = sug.titleHighlights[ix]
        if (thl.start !== prevTitleIx) {
          loc.titleParts.push({
            text: loc.title.substring(prevTitleIx, thl.start),
            highlight: false,
          })
        }
        loc.titleParts.push({
          text: loc.title.substring(thl.start, thl.end),
          highlight: true,
        })
        prevTitleIx = thl.end
      }
      if (prevTitleIx < loc.title.length) {
        loc.titleParts.push({
          text: loc.title.substring(prevTitleIx),
          highlight: false,
        })
      }
      if (sug.resultType === 'place') {
        // A place has only a short title, add the address line as subtitle
        loc.subtitle = geoPlaceToAddressLabel(loc, false)
      } else {
        // 'locality', 'street', 'houseNumber' have a complete address line as title (from the geoservice)
      }
      return loc
    },
    completeSearch(place) {
      const fieldName = this.$route.params.field
      gsStore.mutations.setGeoLocationPicked({
        query: this.searchInput || place.subtitle,
        field: fieldName,
        place: place,
      })
      // If we are editing our current search results then
      // set the criteria accordingly and do the search.
      if (this.localEditSearchCriteria) {
        const fieldValue = geoPlaceToCriteria(place)
        const searchCriteria = isStore.getters.getSearchCriteria
        if (fieldName === 'from') {
          searchCriteria.from = fieldValue
        } else if (fieldName === 'to') {
          searchCriteria.to = fieldValue
        } else {
          uiStore.actions.queueErrorNotification(
            `Interne fout: Onbekend veld ${fieldName}.`
          )
        }
        isStore.mutations.setSearchCriteria(searchCriteria)
        this.sendPlanningRequest()
      }
      this.$router.go(-1)
    },
    sendPlanningRequest() {
      const searchCriteria = isStore.getters.getSearchCriteria
      const preferences = isStore.getters.getPlanningRequest?.preferences
      const { from, to, travelTime } = searchCriteria
      isStore.actions.searchTripPlan({
        from,
        to,
        travelTime,
        preferences: preferences,
      })
    },
    clearSearchInput() {
      this.searchInput = ''
      this.showSuggestionsList = false
      gsStore.mutations.setGeocoderSuggestions([])
    },
    promptFavorite(suggestion) {
      this.selectedLocation = suggestion
    },
    cancelFavorite() {
      this.selectedLocation = null
    },
    addFavorite(place) {
      // Hide dialog
      this.selectedLocation = null
      // Check for duplicates
      let duplicate = this.favorites.find((f) => f.ref === place.ref)
      if (duplicate) {
        uiStore.actions.queueErrorNotification(
          'Favoriet bestaat al in uw profiel.'
        )
      } else {
        const profileId = psStore.getters.getProfile.id
        psStore.actions.storeFavoriteLocation({ profileId, place })
      }
    },
    removeFavorite(favorite) {
      const profileId = psStore.getters.getProfile.id
      let placeId = favorite.id
      if (!placeId) {
        placeId = this.favorites.find((f) => f.ref === favorite.ref)?.id
      }
      psStore.actions.deleteFavoriteLocation({ profileId, placeId })
    },
    iconicCategory(category) {
      return (
        constants.searchSuggestionCategoryIcons[category] ||
        constants.searchSuggestionDefaultIcon
      )
    },
  },
}
</script>

<style lang="scss"></style>
