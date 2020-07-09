<template>
  <v-list>
    <v-list-item-group v-model="selectedListItem">
      <template v-for="(location, index) in locations">
        <v-divider :key="index" />
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
                v-if="showHighlightedText"
                class="text-truncate"
                v-html="stripBreakLines(location.highlightedVicinity)"
              ></div>
              <div
                v-else
                class="text-truncate"
                v-html="stripBreakLines(location.vicinity)"
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
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
import constants from '@/constants/constants.js'

export default {
  name: 'LocationsList',
  props: {
    locations: { type: Array, required: true },
    showHighlightedText: { type: Boolean, default: true },
  },
  data() {
    return {
      selectedListItem: null,
    }
  },
  methods: {
    iconicCategory(category) {
      return (
        constants.searchSuggestionCategoryIcons[category] ||
        constants.searchSuggestionDefaultIcon
      )
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
