<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <v-row dense>
          <v-col>
            <h1>Reisvoorkeuren</h1>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <search-options
              v-model="searchPreferences"
              v-on:onSearchOptionsSave="saveSearchOptions"
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

export default {
  name: 'SearchOptionsPage',
  components: {
    ContentPane,
    SearchOptions,
  },
  data: function() {
    return {
      searchPreferences: {},
    }
  },
  created() {
    this.$store.commit('ui/showBackButton')
    // Clone search preferences so we can pass it as v-model and persist it
    // when onSearchOptionsSave is emitted.
    this.searchPreferences = {
      ...this.$store.getters['ps/getProfile'].searchPreferences,
    }
  },
  methods: {
    saveSearchOptions() {
      this.$store.dispatch('ps/storeSearchPreferences', this.searchPreferences)
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss"></style>
