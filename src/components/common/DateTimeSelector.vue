<template>
  <v-row dense>
    <v-col cols="5">
      <v-dialog v-model="showDatePicker" persistent>
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="Datum"
            readonly
            prepend-icon="event"
            hide-details
            class="my-0 py-0"
            v-on="on"
          >
          </v-text-field>
        </template>
        <!-- v-if forces initialization of date picker when dialog is reopened -->
        <v-date-picker
          v-if="showDatePicker"
          v-model="pickedDate"
          :allowed-dates="allowedDates"
          locale="nl-NL"
          scrollable
        >
          <v-btn text color="primary" @click="cancelDate">
            Annuleren
          </v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!pickedDate"
            @click="confirmDate"
          >
            Ok
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </v-col>
    <v-col cols="6">
      <v-dialog v-model="showTimePicker" persistent>
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="time"
            :label="arriving ? 'Aankomst' : 'Vertrek'"
            prepend-icon="access_time"
            readonly
            hide-details
            class="my-0 py-0"
            v-on="on"
          >
          </v-text-field>
        </template>
        <v-card>
          <v-tabs :value="pickedArriving ? 0 : 1" grow>
            <v-tab @click="pickedArriving = true">Aankomst</v-tab>
            <v-tab @click="pickedArriving = false">Vertrek</v-tab>
          </v-tabs>
          <!-- v-if forces initialization of time picker when dialog is reopened -->
          <v-time-picker
            v-if="showTimePicker"
            v-model="pickedTime"
            full-width
            scrollable
            :allowed-minutes="allowedMinutes"
            format="24hr"
            class="time-picker"
          />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="cancelTime">
              Annuleren
            </v-btn>
            <v-btn
              text
              color="primary"
              :disabled="!pickedTime"
              @click="confirmTime"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'

import {
  DATE_FORMAT_INPUT,
  DATE_FORMAT_PICKER,
  TIME_FORMAT,
  TIMESTAMP_FORMAT,
  formatDateInputFromPicker,
} from '@/utils/datetime.js'

export default {
  name: 'DateTimeSelector',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
    allowedDates: {
      type: Function,
      default: () => true,
    },
    allowedMinutes: {
      type: Function,
      default: m => m % 5 == 0,
    },
  },
  data() {
    return {
      showDatePicker: false,
      showTimePicker: false,
      pickedDate: null,
      pickedTime: null,
      pickedArriving: true,
      date: null,
      time: null,
      arriving: true,
    }
  },
  watch: { value: 'initialize' },
  mounted() {
    this.initialize()
  },
  methods: {
    initialize() {
      const { when, arriving } = this.value || {}
      if (when) {
        this.pickedDate = when.format(DATE_FORMAT_PICKER)
        this.date = when.format(DATE_FORMAT_INPUT)
        this.time = this.pickedTime = when.format(TIME_FORMAT)
        this.arriving = arriving
      }
    },
    emitInput() {
      const { date, time } = this
      if (date && time) {
        this.$emit('dateTimeChanged', {
          when: moment(`${this.date} ${this.time}`, TIMESTAMP_FORMAT),
          arriving: this.arriving,
        })
      }
    },
    cancelDate() {
      this.showDatePicker = false
      this.pickedDate =
        this.date &&
        moment(this.date, DATE_FORMAT_INPUT).format(DATE_FORMAT_PICKER)
    },
    confirmDate() {
      this.showDatePicker = false
      this.date = formatDateInputFromPicker(this.pickedDate)
      this.emitInput()
    },
    cancelTime() {
      this.showTimePicker = false
      this.pickedTime = this.time
      this.pickedArriving = this.arriving
    },
    confirmTime() {
      //TODO: Check time in the past here.
      this.showTimePicker = false
      this.time = this.pickedTime
      this.arriving = this.pickedArriving
      this.pickedArriving = this.arriving
      this.emitInput()
    },
  },
  saveModel(model) {
    if (model) {
      return {
        when: model.when.format(TIMESTAMP_FORMAT),
        arriving: model.arriving,
      }
    }
  },
  restoreModel(json) {
    if (json) {
      return {
        when: moment(json.when, TIMESTAMP_FORMAT),
        arriving: json.arriving,
      }
    }
  },
}
</script>

<style scoped>
.time-picker {
  border-radius: 0px !important;
}

.bg-white {
  background-color: white !important;
}
</style>
