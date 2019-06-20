<template>
  <v-container fluid>
    <v-layout>
      <v-text-field
        v-model="searchInput"
        outline
        prepend-inner-icon="search"
        clearable
        placeholder="Zoek..."
        class="border-radius-input"
        single-line
      ></v-text-field>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <v-list pt-0>
          <template v-for="(location, index) in locations">
            <v-list-tile :key="location.name" @click="completeSearch(location)">
              <v-icon class="mr-3">{{ location.type }}</v-icon>
              <v-list-tile-content class="grey--text">
                <v-list-tile-title>
                  <div v-html="location.label"></div>
                </v-list-tile-title>
                <v-list-tile-sub-title> </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider v-if="index + 1 < locations.length" :key="index">
            </v-divider>
          </template>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'SearchLocation',
  data() {
    return {
      searchInput: '',
    }
  },
  computed: {
    locations() {
      return this.$store.getters.getGeocoderSuggestions
    },
  },
  watch: {
    searchInput: function(val) {
      if (val.length > 3) {
        this.$store.dispatch('fetchGeocoderSuggestions', val)
      }
    },
  },
  methods: {
    completeSearch(location) {
      this.$store.dispatch('fetchGeocoderLocation', location.locationId)
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss">
.border-radius-input > .v-input__control > .v-input__slot {
  border-radius: $form-border-radius-input;
}
</style>
