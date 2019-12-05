<template>
  <v-list width="100%">
    <v-list-item-group>
      <template v-for="(location, index) in locations">
        <v-list-item :key="location.id">
          <v-list-item-icon @click="$emit('onItemClicked', location)">
            <v-icon>{{ iconicCategory(location.category) }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content @click="$emit('onItemClicked', location)">
            <v-list-item-title v-if="location.label !== undefined">
              {{ location.label }} ({{ location.title }})
            </v-list-item-title>
            <v-list-item-title v-if="showHighlightedText">
              <div
                class="text-truncate"
                v-html="location.highlightedTitle"
              ></div>
            </v-list-item-title>
            <v-list-item-title v-else>
              {{ location.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <div
                class="text-truncate"
                v-html="stripBreakLines(location.highlightedVicinity)"
              ></div>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon
            v-if="showFavoriteButton"
            @click="$emit('onFavoriteClicked', location)"
          >
            <v-icon>favorite_border</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider v-if="index + 1 < locations.length" :key="index" />
      </template>
    </v-list-item-group>
  </v-list>
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
  name: 'LocationsList',
  props: {
    locations: {
      type: Array,
      required: true,
    },
    showFavoriteButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    showHighlightedText: {
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
      return value.replace(/<br>/gi, '')
    },
  },
}
</script>

<style lang="scss"></style>
