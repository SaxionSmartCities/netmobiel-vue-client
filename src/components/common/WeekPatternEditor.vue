<template>
  <div>
    <v-checkbox
      v-for="(day, index) of weekdays"
      :key="day"
      :label="capitalize(day)"
      hide-details
      @change="$emit('week-pattern', toggle(index))"
    />
  </div>
</template>

<script>
import { weekdays } from 'moment'
import { upperCaseFirst } from '@/utils/Utils.js'

export default {
  name: 'WeekPatternEditor',
  data: () => ({ mask: 0 }),
  computed: {
    weekdays() {
      // true parameter forces locale-specific order of weekdays (Monday comes first in nl locale)
      return weekdays(true)
    },
  },
  methods: {
    capitalize(weekday) {
      return upperCaseFirst(weekday)
    },
    toggle(index) {
      const bit = 2 ** index
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

<style scoped></style>
