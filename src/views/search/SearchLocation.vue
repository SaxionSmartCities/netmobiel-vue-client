<template>
  <v-container>
    <v-layout>
      <v-text-field
        outline
        prepend-inner-icon="search"
        clearable
        placeholder="Zoek..."
        single-line
      ></v-text-field>
    </v-layout>
    <v-layout>
      <v-list>
        <v-
      </v-list>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'SearchLocation',
  computed: {
    locations() {
      return this.$store.getters.getLocations
    },
  },
}
</script>

<style scoped></style>
