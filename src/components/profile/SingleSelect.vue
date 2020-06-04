<template>
  <div class="single-select-container">
    <div class="d-flex justify-space-between">
      <div
        v-for="option in options"
        :key="option.value"
        class="option"
        :class="{ 'active-option': option.value === activeOption }"
        @click="onSelect(option)"
      >
        <span class="body-1 font-weight-light">
          {{ option.title }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleSelect',
  props: {
    options: { type: Array, required: true },
  },
  data() {
    return {
      activeOption: 'driver',
    }
  },
  methods: {
    onSelect(option) {
      console.log('do something', option)
      this.activeOption = option.value
      // Always emit when something is being selected, even if it is the same option
      this.$emit('select', option)
      // Only if the value changes emit something.
      if (option.value !== this.activeOption) {
        this.$emit('change', option)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.single-select-container {
  border-radius: $single-border-radius;
  padding: 5px;
  background-color: $single-select-background-color;
  .option {
    border-radius: $single-border-radius;
    color: lighten(#000000, 50%);
    padding: 5px;
  }
  .active-option {
    background-color: white;
  }
}
</style>
