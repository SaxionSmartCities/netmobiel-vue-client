<template>
  <v-row dense>
    <v-select
      v-model="selectedRepetition"
      :items="repetitions"
      prepend-icon="replay"
      hide-details
      :disabled="disabled || !origin"
      placeholder="Aangepaste herhaling"
      class="my-0 py-0"
    />
    <v-dialog v-model="showCustom" persistent>
      <v-card class="px-5">
        <v-card-title>Aangepaste herhaling</v-card-title>
        <v-divider class="mb-3"></v-divider>
        <v-row row align-center ml-0>
          <v-col xs3>
            <span>Herhaal:</span>
          </v-col>
        </v-row>
        <v-row row align-center ml-0>
          <v-col xs9 pl-7 py-2>
            <v-radio-group v-model="weeks" hide-details class="ma-0 pa-0">
              <v-radio label="Wekelijks" value="ONE_WEEK" />
              <v-radio label="Om de 2 weken" value="TWO_WEEKS" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row row align-center ml-0>
          <v-col xs3>
            <span>Op:</span>
          </v-col>
        </v-row>
        <v-row row align-center ml-0>
          <v-col xs9 pl-7>
            <week-pattern-editor v-model="weekPattern" />
          </v-col>
        </v-row>
        <v-row row align-center ml-0>
          <v-col xs3>
            <span>Tot:</span>
          </v-col>
        </v-row>
        <v-row row align-center ml-0>
          <v-col xs9 pl-7>
            <v-menu
              v-model="showHorizonPicker"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="horizon"
                  prepend-icon="event"
                  class="pt-0"
                  readonly
                  clearable
                  placeholder="Geen einddatum"
                  v-on="on"
                  @click:clear="pickedHorizon = ''"
                ></v-text-field>
              </template>
              <v-date-picker
                v-if="showHorizonPicker"
                v-model="pickedHorizon"
                :allowed-dates="allowedDates"
                locale="nl-NL"
                scrollable
                @input="selectHorizon"
              />
            </v-menu>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="cancelPatternEditor">
            Annuleren
          </v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!weekPattern"
            @click="confirmPatternEditor"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import WeekPatternEditor from './WeekPatternEditor.vue'
import {
  formatDateInputFromPicker,
  formatDatePickerFromInput,
} from '@/utils/datetime.js'

// weekdays according to JavaScript Date class (which differs from recurrence week pattern that starts at Monday)
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
      text: 'Elke week op ' + (origin ? weekdays[origin.day()] : ''),
      value: 'WEEKLY',
    },
    {
      text: 'Anders...',
      value: 'CUSTOM',
    },
  ]
}

// convert model and origin to component state
function computeState(model, origin) {
  const { interval, unit, daysOfWeekMask, horizon } = model || {}
  // empty model?
  if (!unit) {
    return { selectedRepetition: 'ONCE' }
  }
  // only daily repetition uses DAY unit
  if (unit === 'DAY') {
    return { selectedRepetition: 'DAILY' }
  }
  // if horizon is unspecified and repetition follows weekly pattern
  if (!horizon && interval === 1) {
    // repeat weekly for every workday
    if (daysOfWeekMask === 0x1f) {
      return { selectedRepetition: 'WORKDAILY' }
    }
    // repeat weekly for weekday of specified origin
    if (daysOfWeekMask === 1 << (6 + new Date(origin).getDay()) % 7) {
      return { selectedRepetition: 'WEEKLY' }
    }
  }
  // custom repetition
  return {
    selectedRepetition: undefined,
    weekPattern: daysOfWeekMask,
    weeks: interval === 2 ? 'TWO_WEEKS' : 'ONE_WEEK',
    horizon: horizon,
  }
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
      // Moment instance
      type: Object,
      default: () => undefined,
    },
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      showCustom: false,
      showHorizonPicker: false,
      previousRepetition: 'ONCE',
      repetitions: computeRepetitions(this.origin),
      weekPattern: 0,
      weeks: 'ONE_WEEK',
      pickedHorizon: '',
      horizon: '',
      ...computeState(this.value, this.origin),
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
          this.weekPattern = 0xff
          this.horizon = ''
          // week pattern is not significant, when unit is DAY
          this.$emit('input', { interval: 1, unit: 'DAY' })
          break
        }
        case 'WORKDAILY': {
          this.weeks = 'ONE_WEEK'
          // every week on monday (1), tuesday (2), wednesday (4), thursday (8), friday (16) = 31
          this.weekPattern = 0x1f
          this.horizon = ''
          this.$emit('input', {
            daysOfWeekMask: this.weekPattern,
            interval: 1,
            unit: 'WEEK',
          })
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
    value: 'initialize',
  },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {
      Object.assign(this, computeState(this.value, this.origin))
    },
    emitWeekly() {
      // convert from Moment API convention (i.e. sunday = 0) to ISO8601 convention (i.e. monday = 0)
      const index = (6 + this.origin.day()) % 7
      this.weeks = 'ONE_WEEK'
      this.weekPattern = 1 << index
      this.horizon = ''
      this.$emit('input', {
        daysOfWeekMask: this.weekPattern,
        interval: 1,
        unit: 'WEEK',
      })
    },
    selectHorizon() {
      this.showHorizonPicker = false
      this.horizon = formatDateInputFromPicker(this.pickedHorizon)
    },
    allowedDates(v) {
      // at least tomorrow, or further in the future
      return new Date(v) > new Date()
    },
    cancelPatternEditor() {
      this.showCustom = false
      this.selectedRepetition = this.previousRepetition
    },
    confirmPatternEditor() {
      this.showCustom = false
      if (this.weeks === 'ONE_WEEK' && !this.horizon) {
        const weekdaySelection = 1 << (6 + new Date(this.origin).getDay()) % 7
        if (this.weekPattern === weekdaySelection) {
          this.selectedRepetition = 'WEEKLY'
          return
        }
        // check whether 'custom' pattern matches every workday
        if (this.weekPattern === 0x1f) {
          this.selectedRepetition = 'WORKDAILY'
          return
        }
        // check whether 'custom' pattern matches every day
        if (this.weekPattern === 0xff) {
          this.selectedRepetition = 'DAILY'
          return
        }
      }
      this.selectedRepetition = undefined
      this.$emit('input', {
        daysOfWeekMask: this.weekPattern,
        interval: this.weeks === 'ONE_WEEK' ? 1 : 2,
        unit: 'WEEK',
        horizon:
          (this.horizon && formatDatePickerFromInput(this.horizon)) ||
          undefined,
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
