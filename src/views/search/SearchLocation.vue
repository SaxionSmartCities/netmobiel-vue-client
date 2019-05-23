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
          <template v-for="(location, index) in filteredList">
            <v-list-tile :key="location.name">
              <v-list-tile-content class="grey--text">
                <v-list-tile-title>
                  <div v-html="highlight(location.name)"></div>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider v-if="index + 1 < filteredList.length" :key="index">
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
      return this.$store.getters.getLocations
    },
    filteredList() {
      return this.locations.filter(item => {
        return item.name.includes(this.searchInput)
      })
    },
  },
  methods: {
    highlight(str) {
      return str.replace(new RegExp(this.searchInput, 'gi'), match => {
        return '<span class="font-weight-bold">' + match + '</span>'
      })
    },
  },
}
</script>

<style lang="scss">
.theme--light.v-text-field--outline > .v-input__control > .v-input__slot {
  border-radius: $form-border-radius-input;
}
</style>
