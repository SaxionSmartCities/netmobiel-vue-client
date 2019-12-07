<template>
  <div>
    <v-select
      v-model="selectedRepetition"
      :items="repetitions"
      prepend-icon="replay"
      :disabled="disabled || !origin"
      placeholder="Aangepaste herhaling"
    />
    <v-dialog v-model="showCustom" persistent>
      <v-card class="pattern-editor">
        <v-card-title>Aangepaste herhaling</v-card-title>
        <v-layout row align-center>
          <v-flex xs3>
            <span>Herhaal</span>
          </v-flex>
          <v-flex xs9>
            <v-radio-group v-model="weeks" hide-details class="ma-0 pa-0">
              <v-radio label="wekelijks" value="ONE_WEEK" />
              <v-radio label="om de 2 weken" value="TWO_WEEKS" />
            </v-radio-group>
          </v-flex>
        </v-layout>
        <v-layout row align-center>
          <v-flex xs3>
            <span>Op</span>
          </v-flex>
          <v-flex xs9>
            <week-pattern-editor v-model="weekpattern" />
          </v-flex>
        </v-layout>
        <v-layout row align-center>
          <v-flex xs3>
            <span>Tot</span>
          </v-flex>
          <v-flex xs9>
            <v-menu
              v-model="showHorizonPicker"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="horizon"
                  prepend-icon="event"
                  readonly
                  clearable
                  placeholder="Einde der tijden"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="horizon"
                @input="showHorizonPicker = false"
              />
            </v-menu>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="cancelPatternEditor">
            Annuleren
          </v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!weekpattern"
            @click="confirmPatternEditor"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WeekPatternEditor from './WeekPatternEditor.vue'

// weekdays according to JavaScript Date class (which differs from recurrence weekpattern that starts at Monday)
const weekdays = [
  'zondag',
  'maandag',
  'dinsdag',
  'woensdag',
  'donderdag',
  'vrijdag',
  'zaterdag',
]

// compute repetition selections (recompute when origin prop changes)
function computeRepetitions(origin) {
  return [
    {
      text: 'Niet herhaald',
      value: 'ONCE',
    },
    {
      text: 'Dagelijks',
      value: 'DAILY',
    },
    {
      text: 'Elke werkdag (ma t/m vr)',
      value: 'WORKDAILY',
    },
    {
      text:
        'Elke week op ' + (origin ? weekdays[new Date(origin).getDay()] : ''),
      value: 'WEEKLY',
    },
    {
      text: 'Aanpassen...',
      value: 'CUSTOM',
    },
  ]
}

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
    origin: {
      type: String,
      default: '',
    },
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      selectedRepetition: 'ONCE',
      repetitions: computeRepetitions(this.origin),
      weekpattern: 0,
      weeks: 'ONE_WEEK',
      horizon: '',
      showCustom: false,
      showHorizonPicker: false,
      previousRepetition: 'ONCE',
    }
  },
  watch: {
    selectedRepetition(repetition, previousRepetition) {
      switch (repetition) {
        case 'CUSTOM':
          this.showCustom = true
          // hold on to previous repetition and restore it when custom dialog is cancelled
          this.previousRepetition = previousRepetition
          break
        case 'ONCE': {
          // leave recurrence undefined when it should not be repeated
          this.$emit('input', undefined)
          break
        }
        case 'DAILY': {
          this.weeks = 'ONE_WEEK'
          this.weekpattern = 127
          this.horizon = ''
          // weekpattern is not significant, when unit is DAY
          this.$emit('input', { interval: 1, unit: 'DAY' })
          break
        }
        case 'WORKDAILY': {
          this.weeks = 'ONE_WEEK'
          this.weekpattern = 31
          this.horizon = ''
          // every week on monday (1), tuesday (2), wednesday (4), thursday (8), friday (16) = 31
          this.$emit('input', { daysOfWeekMask: 31, interval: 1, unit: 'WEEK' })
          break
        }
        case 'WEEKLY': {
          this.emitWeekly()
          break
        }
      }
    },
    origin(value) {
      this.repetitions = computeRepetitions(value)
      if (this.selectedRepetition === 'WEEKLY') {
        this.emitWeekly()
      }
    },
  },
  methods: {
    emitWeekly() {
      // convert from JavaScript convention (i.e. sunday = 0) to ISO8601 convention (i.e. monday = 0)
      const index = (6 + new Date(this.origin).getDay()) % 7
      this.weeks = 'ONE_WEEK'
      this.weekpattern = 1 << index
      this.horizon = ''
      this.$emit('input', {
        daysOfWeekMask: this.weekpattern,
        interval: 1,
        unit: 'WEEK',
      })
    },
    cancelPatternEditor() {
      this.showCustom = false
      this.selectedRepetition = this.previousRepetition
    },
    confirmPatternEditor() {
      this.showCustom = false
      if (this.weeks === 'ONE_WEEK' && !this.horizon) {
        const weekdaySelection = 1 << (6 + new Date(this.origin).getDay()) % 7
        if (this.weekpattern === weekdaySelection) {
          this.selectedRepetition = 'WEEKLY'
          return
        }
        // check whether 'custom' pattern matches every workday
        if (this.weekpattern === 31) {
          this.selectedRepetition = 'WORKDAILY'
          return
        }
        // check whether 'custom' pattern matches every day
        if (this.weekpattern === 127) {
          this.selectedRepetition = 'DAILY'
          return
        }
      }
      this.selectedRepetition = undefined
      this.$emit('input', {
        daysOfWeekMask: this.weekpattern,
        interval: this.weeks === 'ONE_WEEK' ? 1 : 2,
        unit: 'WEEK',
        horizon: this.horizon || undefined,
      })
    },
  },
}
</script>

<style scoped>
.pattern-editor {
  background-color: white;
  padding: 1em;
}
</style>