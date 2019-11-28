<template>
  <div>
    <v-select
      v-model="selectedRepetition"
      :items="repetitions"
      prepend-icon="replay"
      :disabled="disabled"
    />
    <v-dialog v-model="showCustom" persistent>
      <v-card class="pattern-editor">
        <v-card-title>Selecteer weekpatroon</v-card-title>
        <week-pattern-editor :value="weekpattern" />
        <v-card-actions text-right>
          <v-btn text color="primary" @click="cancelPatternEditor">
            Annuleren
          </v-btn>
          <v-btn text color="primary" @click="cancelPatternEditor">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WeekPatternEditor from './WeekPatternEditor.vue'

void WeekPatternEditor

// according to JavaScript Date class (which differs from recurrence weekpattern that starts at Monday)
const weekdays = [
  'zondag',
  'maandag',
  'dinsdag',
  'woensdag',
  'donderdag',
  'vrijdag',
  'zaterdag',
]

export default {
  name: 'RecurrenceEditor',
  components: {
    WeekPatternEditor,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({
        daysOfWeek: 0,
        horizon: '',
        interval: 0,
        unit: 'DAY',
      }),
    },
  },
  data() {
    return {
      showCustom: false,
      selectedRepetition: 'ONCE',
      today: new Date().getDay(),
      weekpattern: this.value.daysOfWeek,
    }
  },
  computed: {
    repetitions() {
      return [
        {
          text: 'Niet herhaald',
          value: 'ONCE',
        },
        {
          text: 'Elke dag',
          value: 'DAILY',
        },
        {
          text: 'Elke werkdag (maandag t/m vrijdag)',
          value: 'WORKDAY',
        },
        {
          text: `Elke week op ${weekdays[this.today]}`,
          value: 'WEEKLY',
        },
        {
          text: 'Aangepast...',
          value: 'CUSTOM',
        },
      ]
    },
  },
  watch: {
    selectedRepetition(repetition, oldRepetition) {
      console.log(repetition, oldRepetition)
      switch (repetition) {
        case 'CUSTOM':
          this.showCustom = true
          console.log('customize...')
          return
      }
    },
  },
  methods: {
    cancelPatternEditor() {
      this.showCustom = false
    },
  },
}
</script>

<style scoped>
.pattern-editor {
  background-color: white;
}
</style>
