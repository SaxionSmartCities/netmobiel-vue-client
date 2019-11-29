<template>
  <div>
    <v-select
      v-model="selectedRepetition"
      :items="repetitions"
      prepend-icon="replay"
      :disabled="disabled || !origin"
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
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="until"
                  prepend-icon="event"
                  readonly
                  placeholder="Einde der tijden"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="until" @input="menu2 = false" />
            </v-menu>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-spacer />
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

// according to JavaScript Date class (which differs from recurrence weekpattern that starts at Monday)
// const weekdays = [
//   'zondag',
//   'maandag',
//   'dinsdag',
//   'woensdag',
//   'donderdag',
//   'vrijdag',
//   'zaterdag',
// ]

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
      default: () => ({
        daysOfWeek: 9,
        horizon: '',
        interval: 0,
        unit: 'DAY',
      }),
    },
  },
  data() {
    return {
      selectedRepetition: 'ONCE',
      showCustom: false,
      weekpattern: this.value.daysOfWeek,
      weeks: 'ONE_WEEK',
      until: '',
      //TODO better naming
      menu2: false,
      repetitions: [
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
          text: 'Elke week op ',
          value: 'WEEKLY',
        },
        {
          text: 'Aangepast...',
          value: 'CUSTOM',
        },
      ],
    }
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
    weekpattern(mask) {
      console.log('week', mask)
    },
  },
  mounted() {
    console.log('mounted value', this.value)
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
  padding: 1em;
}
</style>
