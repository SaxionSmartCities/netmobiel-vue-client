<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row dense>
        <v-col>
          <span>{{ value.title }}</span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col v-for="option in value.options" :key="option.key">
          <v-icon>{{ option.icon }}</v-icon>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row dense>
        <v-col v-for="option in value.options" :key="option.key">
          <v-checkbox
            v-model="value.selected"
            :label="option.label"
            :value="option"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'SearchOptionsIconExpansionPanel',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
}
</script>

<style lang="scss"></style>
