<template>
  <generic-list :items="suggestions" :empty-list-label="emptyListLabel">
    <template v-slot:list-item="{ item: locView }">
      <v-row no-gutters>
        <v-col
          class="shrink category align-center pa-2 ml-1"
          @click="onItemClicked(locView.location)"
        >
          <v-icon>{{ iconicCategory(locView.location.category) }}</v-icon>
        </v-col>
        <v-col class="grow px-2" @click="onItemClicked(locView.location)">
          <v-row no-gutters>
            <v-col v-if="showHighlightedText" class="">
              <!-- Leave the peculiar looking comment in the line below,
                   it prevents insertion of an additional space in the span -->
              <span
                v-for="(part, i) in locView.titleParts"
                :key="i"
                :class="part.highlight ? 'highlight' : ''"
                >{{ part.text
                }}<!--
              --></span>
            </v-col>
            <v-col v-else>
              {{ locView.title }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="subtitle-2 font-weight-light">
              {{ locView.label }}
            </v-col>
          </v-row>
        </v-col>
        <v-col
          v-if="!locView.location.favorite && showFavoriteIcon"
          class="shrink pa-2"
          @click="onFavoriteClicked(locView.location, $event)"
        >
          <v-icon>favorite_border</v-icon>
        </v-col>
        <v-col
          v-if="locView.location.favorite && showFavoriteIcon"
          class="shrink pa-2"
          @click="onUnFavoriteClicked(locView.location, $event)"
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
    showFavoriteIcon: { type: Boolean, default: true },
    emptyListLabel: { type: String, required: true },
  },
  data() {
    return {
      selectedListItem: null,
    }
  },
  computed: {
    suggestions() {
      return this.locations.map(loc => this.createLocationView(loc))
    },
  },
  methods: {
    createLocationView(loc) {
      let v = {
        location: loc,
        titleParts: [],
        title: loc.title.replace(', Nederland', ''),
        label: '',
      }
      let prevTitleIx = 0
      for (let ix = 0; ix < loc.titleHighlights?.length; ix++) {
        let thl = loc.titleHighlights[ix]
        if (thl.start !== prevTitleIx) {
          v.titleParts.push({
            text: v.title.substring(prevTitleIx, thl.start),
            highlight: false,
          })
        }
        v.titleParts.push({
          text: v.title.substring(thl.start, thl.end),
          highlight: true,
        })
        prevTitleIx = thl.end
      }
      if (prevTitleIx < v.title.length) {
        v.titleParts.push({
          text: v.title.substring(prevTitleIx),
          highlight: false,
        })
      }
      switch (loc.resultType) {
        case 'place':
          v.label = this.addressLine(loc)
          break
        case 'locality':
          break
        case 'street':
          break
        case 'houseNumber':
          break
      }
      return v
    },
    addressLine(addr) {
      return addr
        ? `${addr.street} ${addr.houseNumber} ${addr.locality} (${addr.stateCode})`
        : ''
    },
    iconicCategory(category) {
      return (
        constants.searchSuggestionCategoryIcons[category] ||
        constants.searchSuggestionDefaultIcon
      )
    },
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
