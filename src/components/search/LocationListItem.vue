<template>
  <v-list-item two-line>
    <v-list-item-icon>
      <v-icon>{{ iconicCategory(suggestion.category) }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>
        <div class="text-truncate" v-html="suggestion.highlightedTitle"></div>
      </v-list-item-title>
      <v-list-item-subtitle>
        <div
          class="text-truncate"
          v-html="stripBreakLines(suggestion.highlightedVicinity)"
        ></div>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-icon>
      <v-icon>favorite</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
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

export default {
  name: 'LocationListItem',
  props: {
    suggestion: {
      type: Object,
      required: true,
    },
    hideFavorite: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    iconicCategory(category) {
      return categoryIcons[category] || 'fa-map-marker-alt'
    },
    stripBreakLines(value) {
      let stripStageOne = value.replace('<br>', '')
      let stripStageTwo = stripStageOne.replace('<br/>', '')

      return stripStageTwo
    },
  },
}
</script>

<style lang="scss" scoped></style>
