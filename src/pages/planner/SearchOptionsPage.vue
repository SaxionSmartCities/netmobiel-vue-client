<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <v-row dense>
          <v-col>
            <h1>Ritvoorkeuren</h1>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <search-options
              v-model="searchPreferences"
              @onSearchOptionsSave="onSearchOptionsSave"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import SearchOptions from '@/components/search/SearchOptions.vue'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

export default {
  name: 'SearchOptionsPage',
  components: {
    ContentPane,
    SearchOptions,
  },
  data() {
    return {
      searchPreferences: {},
    }
  },
  created() {
    uiStore.mutations.showBackButton()
    // Clone search preferences so we can pass it as v-model and persist it
    // when onSearchOptionsSave is emitted.
    this.searchPreferences = {
      ...psStore.getters.getProfile.searchPreferences,
    }
  },
  methods: {
    onSearchOptionsSave(options) {
      psStore.actions
        .storeSearchPreferences(options)
        .then(() => this.$router.go(-1))
    },
  },
}
</script>

<style lang="scss"></style>
