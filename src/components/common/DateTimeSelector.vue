<template>
  <v-layout>
    <v-flex>
      <v-dialog v-model="showDatePicker" persistent>
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="Datum"
            readonly
            prepend-icon="event"
            hide-details
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
          <v-spacer></v-spacer>
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
    </v-flex>
    <v-flex>
      <v-dialog v-model="showTimePicker" persistent>
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="time"
            :label="arriving ? 'Aankomst' : 'Vertrek'"
            prepend-icon="access_time"
            readonly
            hide-details
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
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

const DATE_FORMAT_INPUT = 'DD-MM-YYYY',
  DATE_FORMAT_PICKER = 'YYYY-MM-DD',
  TIME_FORMAT = 'HH:mm',
  TIMESTAMP_FORMAT = `${DATE_FORMAT_INPUT} ${TIME_FORMAT}`

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
      pickedArriving: false,
      date: null,
      time: null,
      arriving: false,
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
      }
      this.arriving = this.pickedArriving = arriving || false
    },
    emitInput() {
      const { date, time } = this
      if (date && time) {
        this.$emit('input', {
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
      this.date = moment(this.pickedDate, DATE_FORMAT_PICKER).format(
        DATE_FORMAT_INPUT
      )
      this.emitInput()
    },
    cancelTime() {
      this.showTimePicker = false
      this.pickedTime = this.time
      this.pickedArriving = this.arriving
    },
    confirmTime() {
      this.showTimePicker = false
      this.time = this.pickedTime
      this.arriving = this.pickedArriving
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
</style>
