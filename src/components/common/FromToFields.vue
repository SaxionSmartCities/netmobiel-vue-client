<template>
  <v-row dense>
    <v-col id="vannaar" cols="10">
      <v-row dense>
        <v-col id="van" @click="toLocationSuggestionsPage('from')">
          <v-text-field
            hide-details
            outlined
            readonly
            dense
            label="Van"
            :value="fromLocationLabel()"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col @click="toLocationSuggestionsPage('to')">
          <v-text-field
            hide-details
            outlined
            readonly
            dense
            label="Naar"
            :value="toLocationLabel()"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col id="heenweericoon" class="text-center align-self-center">
      <v-icon>import_export</v-icon>
    </v-col>
  </v-row>
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
