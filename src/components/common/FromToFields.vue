<template>
  <v-row dense>
    <v-col cols="11">
      <v-row dense>
        <v-col @click="$emit('fieldSelected', { field: 'from' })">
          <v-text-field
            class="bg-white"
            hide-details
            outlined
            readonly
            dense
            label="Van"
            :value="fromLocationLabel"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col @click="$emit('fieldSelected', { field: 'to' })">
          <v-text-field
            class="bg-white"
            hide-details
            outlined
            readonly
            dense
            label="Naar"
            :value="toLocationLabel"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="1" class="text-center align-self-center">
      <v-icon @click="swapLocations()">import_export</v-icon>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'FromToFields',
  props: {
    value: { type: Object, default: () => undefined },
  },
  computed: {
    fromLocationLabel() {
      return this.value?.from?.label || 'Klik hier voor vertrekplek'
    },
    toLocationLabel() {
      return this.value?.to?.label || 'Klik hier voor bestemming'
    },
  },
  methods: {
    toLocationSuggestionsPage(field) {
      this.$emit('fieldSelected', { field })
    },
    swapLocations() {
      this.$emit('swapLocations')
    },
  },
}
</script>

<style lang="scss">
.bg-white {
  background-color: white !important;
}
</style>
