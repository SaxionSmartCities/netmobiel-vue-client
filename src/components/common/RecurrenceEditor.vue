<template>
  <div>
    <!--    <v-select
          :value="selectedRepetition"
          :items="repeated"
          prepend-icon="replay"
        ></v-select>
    -->
    <week-pattern-editor :value="weekpattern" />
  </div>
</template>

<script>
import WeekPatternEditor from './WeekPatternEditor.vue'

export default {
  name: 'RecurrenceEditor',
  components: {
    WeekPatternEditor,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { weekpattern: 9 }
  },
  watch: {
    weekpattern(value) {
      console.log('pattern', value)
    },
  },
  mounted() {
    console.log(this)
    console.log(this.value)
  },
}
</script>
