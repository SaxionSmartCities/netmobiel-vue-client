<template>
  <v-layout>
    <v-flex id="vannaar" xs11>
      <v-layout column>
        <v-flex id="van">
          <v-layout column>
            <v-flex @click="toLocationSuggestionsPage('from')">
              <v-text-field
                hide-details
                outlined
                readonly
                label="Van"
                :value="fromLocationLabel()"
              >
              </v-text-field>
            </v-flex>
            <v-flex @click="toLocationSuggestionsPage('to')">
              <v-text-field
                hide-details
                outlined
                readonly
                label="Naar"
                :value="toLocationLabel()"
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex d-flex>
      <v-layout column justify-center @click="swapLocations()">
        <v-flex id="heenweericoon" text-xs-center justify-center shrink>
          <v-icon>import_export</v-icon>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'FromToFields',
  computed: {},
  methods: {
    fromLocationLabel() {
      let location = this.$store.getters['gs/getPickedLocation'].from
      return !location.title
        ? 'Klik hier voor vertrekplek'
        : `${location.title} ${location.vicinity}`
    },
    toLocationLabel() {
      let location = this.$store.getters['gs/getPickedLocation'].to
      return !location.title
        ? 'Klik hier voor bestemming'
        : `${location.title} ${location.vicinity}`
    },
    swapLocations() {
      this.$store.commit('gs/swapLocations')
    },
    toLocationSuggestionsPage(field) {
      this.$router.push({ name: 'searchLocation', params: { field: field } })
    },
  },
}
</script>

<style lang="scss"></style>
