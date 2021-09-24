<template>
  <generic-list
    :items="locations"
    :empty-list-label="emptyListLabel"
    :key-name="'ref'"
  >
    <template v-slot:list-item="{ item: location }">
      <v-row no-gutters>
        <v-col
          class="shrink category align-center pa-2 ml-1"
          @click="onItemClicked(location)"
        >
          <v-icon>{{ location.iconName }}</v-icon>
        </v-col>
        <v-col class="grow px-2" @click="onItemClicked(location)">
          <v-row no-gutters>
            <v-col v-if="showHighlightedText" class="">
              <!-- Leave the peculiar looking comment in the line below,
                   it prevents insertion of an additional space in the span -->
              <span
                v-for="(part, i) in location.titleParts"
                :key="i"
                :class="part.highlight ? 'highlight' : ''"
                >{{ part.text
                }}<!--
              --></span>
            </v-col>
            <v-col v-else>
              {{ location.title }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="subtitle-2 font-weight-light">
              {{ location.subtitle }}
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="!location.favorite && showFavoriteIcon"
          class="shrink pa-2"
          @click="onFavoriteClicked(location, $event)"
        >
          <v-icon>favorite_border</v-icon>
        </v-col>
        <v-col
          v-if="location.favorite && showFavoriteIcon"
          class="shrink pa-2"
          @click="onUnFavoriteClicked(location, $event)"
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

/**
 * The LocationsList shows a list of elements, comprising of the following elements:
 * - An icon (if the location.category is recognized)
 * - A location.title, the upper text line. Used to display the full address from the geoservice or
 *   the name of the favorite place.
 * - A location.titleParts array. If not empty it overrides the title field with a sequence of text parts, each
 *   flagged to be highlighted or not.
 * - A location.subtitle, the lower text line. In general used to display an address
 * - A favorite flag, used to indicate whether the location is a favorite. Clicking the icon will raise an event to
 *   add or remove the favorite.
 */
export default {
  name: 'LocationsList',
  components: { GenericList },
  props: {
    locations: { type: Array, required: true },
    showHighlightedText: { type: Boolean, default: true },
    showFavoriteIcon: { type: Boolean, default: true },
    emptyListLabel: { type: String, required: true },
  },
  data() {
    return {
      selectedListItem: null,
    }
  },
  methods: {
    onItemClicked(location) {
      this.$emit('onItemClicked', location)
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
