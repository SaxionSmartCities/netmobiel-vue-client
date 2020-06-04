<template>
  <div class="single-select-container">
    <div class="d-flex justify-space-between">
      <div
        v-for="option in options"
        :key="option.value"
        class="option d-flex"
        :class="{
          'active-option': option.value === activeOption,
        }"
        @click="onSelect(option)"
      >
        <span class="subtitle-1">
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
    // eslint-disable-next-line vue/require-default-prop
    initValue: { type: String, required: false },
  },
  data() {
    return {
      activeOption: '',
    }
  },
  created() {
    if (!this.initValue) {
      this.activeOption = this.options[0].value
    } else {
      this.activeOption = this.initValue
    }
  },
  methods: {
    onSelect(option) {
      // Only if the value changes emit something.
      if (option.value !== this.activeOption) {
        this.$emit('change', option)
      }
      this.activeOption = option.value
      // Always emit when something is being selected, even if it is the same option
      this.$emit('select', option)
    },
  },
}
</script>

<style lang="scss" scoped>
.single-select-container {
  border-radius: $single-select-border-radius;
  padding: 5px;
  background-color: $single-select-background-color;
  .option {
    border-radius: $single-select-border-radius;
    color: $single-select-text-color;
    padding: 7px;
  }
  .active-option {
    background-color: white;
    box-shadow: $single-select-box-shadow;
  }
}
</style>
