<template>
  <v-list width="100%">
    <v-list-item-group v-model="selectedListItem">
      <template v-for="(location, index) in locations">
        <v-list-item :key="location.id">
          <v-list-item-icon @click="$emit('onItemClicked', location)">
            <v-icon>{{ iconicCategory(location.category) }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content @click="$emit('onItemClicked', location)">
            <v-list-item-title v-if="location.label !== undefined">
              {{ location.label }}
            </v-list-item-title>
            <v-list-item-title v-else-if="showHighlightedText">
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
            v-if="!location.favorite"
            @click="onFavoriteClicked(location, $event)"
          >
            <v-icon>favorite_border</v-icon>
          </v-list-item-icon>
          <v-list-item-icon
            v-else-if="location.favorite"
            @click="onUnFavoriteClicked(location, $event)"
          >
            <v-icon>favorite</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider v-if="index < locations.length" :key="index" class="mx-3" />
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
import suggestions from '@/constants/suggestions.js'

export default {
  name: 'LocationsList',
  props: {
    locations: { type: Array, required: true },
    showHighlightedText: { type: Boolean, default: false },
  },
  data() {
    return {
      selectedListItem: null,
    }
  },
  methods: {
    iconicCategory(category) {
      return suggestions.CATEGORY_ICONS[category] || 'fa-map-marker-alt'
    },
    stripBreakLines(value) {
      return value.replace(/<br>/gi, '')
    },
    onFavoriteClicked(location, event) {
      event.stopPropagation()
      this.selectedListItem = null
      this.$emit('onFavoriteClicked', location)
    },
    onUnFavoriteClicked(location, event) {
      event.stopPropagation()
      this.selectedListItem = null
      this.$emit('onUnFavoriteClicked', location)
    },
  },
}
</script>

<style lang="scss"></style>
