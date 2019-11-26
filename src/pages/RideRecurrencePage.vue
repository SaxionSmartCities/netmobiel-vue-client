<template>
  <week-pattern-editor @week-pattern="onWeekPattern" />
</template>

<script>
import WeekPatternEditor from '@/components/common/WeekPatternEditor.vue'

export default {
  name: 'RideRecurrence',
  components: {
    WeekPatternEditor,
  },
  methods: {
    onWeekPattern(mask) {
      console.log(mask)
    },
  },
}
</script>
