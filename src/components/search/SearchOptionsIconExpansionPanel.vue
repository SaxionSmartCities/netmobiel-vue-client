<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row dense>
        <v-col>
          <span>{{ value.title }}</span>
        </v-col>
      </v-row>
      <v-row dense justify="end" class="pr-1">
        <v-col v-for="(option, index) in selectedOptions" :key="index" cols="2">
          <v-icon>{{ option.icon }}</v-icon>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row dense>
        <v-col v-for="(option, index) in value.options" :key="index" cols="6">
          <v-checkbox
            v-model="selectedOptions"
            :label="option.label"
            :value="option"
            hide-details
            class="mt-0"
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
  computed: {
    selectedOptions: {
      get() {
        return this.value.selected
      },
      set(newValue) {
        this.$emit('onChanged', { ...this.value, selected: newValue })
      },
    },
  },
}
</script>

<style lang="scss"></style>
