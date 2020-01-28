<template>
  <div id="week-pattern-editor">
    <v-checkbox
      v-for="(day, index) of weekdays"
      :key="index"
      v-model="selections[index]"
      :label="day"
      hide-details
      class="mt-0 mb-2"
      @change="$emit('input', toggle(index))"
    />
  </div>
</template>

<script>
const weekdays = [
  'Maandag',
  'Dinsdag',
  'Woensdag',
  'Donderdag',
  'Vrijdag',
  'Zaterdag',
  'Zondag',
]

// compute initial array of booleans that serves as model for v-checkboxes
function initializeSelections(mask) {
  const selections = new Array(7)
  for (let index = 0, bit = 1; index < 7; ++index, bit <<= 1) {
    selections[index] = !!(mask & bit)
  }
  return selections
}

export default {
  name: 'WeekPatternEditor',
  // custom input needs a value prop: https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return { mask: this.value, selections: initializeSelections(this.value) }
  },
  computed: {
    weekdays() {
      return weekdays
    },
  },
  watch: {
    value(value) {
      this.mask = value
      this.selections = initializeSelections(value)
    },
  },
  methods: {
    toggle(index) {
      const bit = 1 << index
      if (this.mask & bit) {
        // clear bit in week mask
        this.mask &= ~bit
      } else {
        // set bit in week mask
        this.mask |= bit
      }
      return this.mask
    },
  },
}
</script>
