<template>
  <v-dialog v-model="showDialog" min-width="300px">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="addressLine"
        clearable
        :outlined="outlined"
        :label="label"
        hide-details="auto"
        readonly
        v-bind="attrs"
        v-on="on"
        @click:clear="clearField"
      />
    </template>
    <v-card>
      <v-card-title>Zoek adres</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="searchInput"
          autofocus
          clearable
          outlined
          placeholder="Zoek adres..."
          prepend-inner-icon="search"
          outline
          single-line
          hide-details
          class="search-field"
          @click:clear="clearSearchInput"
        />
        <locations-list
          v-if="showSuggestionsList"
          :locations="suggestions"
          :empty-list-label="
            showEmptyListLabel ? 'Geen zoekresultaten gevonden' : ''
          "
          show-highlighted-text
          :show-favorite-icon="favorable"
          @onItemClicked="onPlaceSelected"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import LocationsList from '@/components/lists/LocationsList.vue'
import { throttle } from 'lodash'
import { geoPlaceToAddressLabel, geoSuggestionToPlace } from '@/utils/Utils'
import * as gsStore from '@/store/geocoder-service'
import constants from '@/constants/constants'

const maxSuggestions = 8

export default {
  name: 'SearchLocation',
  components: {
    LocationsList,
  },
  props: {
    field: {
      type: String,
      default: 'home',
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    favorable: {
      type: Boolean,
      default: false,
      required: false,
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false,
    },
    address: {
      type: Object,
      default: () => {},
      required: false,
    },
  },
  data() {
    return {
      addressInternal: {},
      showDialog: false,
      searchInput: '',
      showSuggestionsList: false,
      showEmptyListLabel: false,
      selectedLocation: null,
    }
  },
  computed: {
    addressLine() {
      const addr = this.addressInternal?.locality
        ? this.addressInternal
        : this.address
      return addr?.locality ? geoPlaceToAddressLabel(addr, true) : ''
    },
    suggestions() {
      return gsStore.getters.getGeocoderSuggestions.map(suggestion =>
        this.createLocationFromSuggestion(suggestion)
      )
    },
  },
  watch: {
    showDialog(newValue) {
      if (newValue) {
        this.searchInput = gsStore.getters.getPickedLocations.get(
          this.field
        )?.query
        this.showSuggestionsList = true
      }
    },
    searchInput: throttle(function(val) {
      if (val != null) {
        const show = (this.showSuggestionsList = val.length > 3)
        if (show) {
          gsStore.actions.fetchGeocoderSuggestions({
            query: val,
            maxResults: maxSuggestions,
          })
        }
      }
    }, 500),
    suggestions(newVal) {
      // Prevent the empty list label show too early. It should only show once some results have been displayed.
      if (newVal?.length > 0) {
        this.showEmptyListLabel = true
      }
    },
  },
  created() {
    // uiStore.mutations.showBackButton()
  },
  mounted() {
    gsStore.mutations.setGeocoderSuggestions([])
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
    onPlaceSelected(place) {
      gsStore.mutations.setGeoLocationPicked({
        query: this.searchInput || place.subtitle,
        field: this.field,
        place: place,
      })
      this.showSuggestionsList = false
      this.showDialog = false
      this.addressInternal = place
      this.$emit('search-completed', place)
    },
    clearField() {
      this.addressInternal = {}
      this.$emit('search-completed', undefined)
    },
    clearSearchInput() {
      this.searchInput = ''
      gsStore.mutations.setGeocoderSuggestions([])
    },
    iconicCategory(category) {
      return (
        constants.searchSuggestionCategoryIcons[category] ||
        constants.searchSuggestionDefaultIcon
      )
    },
    onFocus() {
      this.showSuggestionsList = true
    },
  },
}
</script>

<style lang="scss">
// Dim the input field a bit when it does not have focus
//.search-field input:not(:focus) {
//  color: gray;
//}
</style>
