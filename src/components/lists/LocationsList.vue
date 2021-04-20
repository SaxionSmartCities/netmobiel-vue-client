<template>
  <generic-list :items="locations" :empty-list-label="emptyListLabel">
    <template v-slot:list-item="{ item: location }">
      <v-row no-gutters>
        <v-col
          class="shrink category align-center pa-2 ml-1"
          @click="$emit('onItemClicked', location)"
        >
          <v-icon>{{ iconicCategory(location.category) }}</v-icon>
        </v-col>
        <v-col class="grow px-2" @click="$emit('onItemClicked', location)">
          <v-row no-gutters>
            <v-col
              v-if="showHighlightedText && location.titleHighlights.length > 0"
            >
              <span>{{
                location.title.substring(0, location.titleHighlights[0].start)
              }}</span>
              <span
                v-for="(split, i) in location.titleHighlights"
                :key="i"
                class="highlight"
                >{{ location.title.substring(split.start, split.end) }}</span
              >
              <span>{{
                location.title.substring(
                  location.titleHighlights[location.titleHighlights.length - 1]
                    .end
                )
              }}</span>
            </v-col>
            <v-col v-else>
              {{ location.title }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="subtitle-2 font-weight-light">
              {{ location.address.label }}
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="!location.favorite"
          class="shrink pa-2"
          @click="onFavoriteClicked(location, $event)"
        >
          <v-icon>favorite_border</v-icon>
        </v-col>
        <v-col
          v-else
          class="shrink pa-2"
          @click="onFavoriteClicked(location, $event)"
        >
          <v-icon>favorite</v-icon>
        </v-col>
      </v-row>
    </template>
  </generic-list>
</template>

<script>
import GenericList from '@/components/lists/GenericList'
import constants from '@/constants/constants.js'

export default {
  name: 'LocationsList',
  components: { GenericList },
  props: {
    locations: { type: Array, required: true },
    showHighlightedText: { type: Boolean, default: true },
  },
  data() {
    return {
      selectedListItem: null,
      emptyListLabel: 'Geen gevonden locatiesop dit moment',
    }
  },
  methods: {
    iconicCategory(category) {
      return (
        constants.searchSuggestionCategoryIcons[category] ||
        constants.searchSuggestionDefaultIcon
      )
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

<style lang="scss">
.category {
  min-width: 40px;
}

.highlight {
  font-weight: bold;
}
</style>
