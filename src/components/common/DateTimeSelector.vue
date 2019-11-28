<template>
  <v-layout>
    <v-flex>
      <v-dialog v-model="dateModal" persistent width="290px">
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
        <v-date-picker v-model="date" :allowed-dates="allowedDates" scrollable>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="
              restoreDate()
              dateModal = false
            "
          >
            Cancel
          </v-btn>
          <v-btn text color="primary" @click="dateModal = false">
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </v-flex>
    <v-flex>
      <v-dialog
        ref="dialog"
        v-model="timeModal"
        :return-value.sync="time"
        width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="time"
            :label="selectedMode == 0 ? 'Aankomst' : 'Vertrek'"
            prepend-icon="access_time"
            readonly
            hide-details
            v-on="on"
            @click="backupTime"
          >
          </v-text-field>
        </template>
        <v-time-picker v-if="timeModal" v-model="time" full-width format="24hr">
          <v-tabs v-model="selectedMode" grow>
            <v-tab>Aankomst</v-tab>
            <v-tab>Vertrek</v-tab>
          </v-tabs>
          <v-btn text color="primary" @click="$refs.dialog.save(time)">
            OK
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'DateTimeSelector',
  props: {
    initialDate: {
      type: String,
      default: '',
      required: false,
    },
    initialTime: {
      type: String,
      default: '',
      required: false,
    },
    initialMode: {
      type: Number,
      default: 0,
      required: false,
    },
    allowedDates: {
      type: Function,
      required: false,
      default: () => true,
    },
  },
  data: function() {
    return {
      localSelectedMode: 0,
      localSearchDate: '',
      localSearchTime: '',
      dateModal: false,
      timeModal: false,
      backupDateValue: '',
      backupTimeValue: '',
    }
  },
  computed: {
    date: {
      get: function() {
        return this.localSearchDate
      },
      set: function(value) {
        this.localSearchDate = value
        this.$emit('dateValueUpdated', value)
      },
    },
    time: {
      get: function() {
        return this.localSearchTime
      },
      set: function(value) {
        this.localSearchTime = value
        this.$emit('timeValueUpdated', value)
      },
    },
    selectedMode: {
      get: function() {
        return this.localSelectedMode
      },
      set: function(value) {
        this.localSelectedMode = value
        this.$emit('modeValueUpdated', value)
      },
    },
  },
  watch: {
    dateModal(value) {
      if (value === true) {
        this.backupDate()
      }
    },
    timeModal(value) {
      if (value === true) {
        this.backupTime()
      }
    },
  },
  mounted() {
    this.localSearchDate = this.initialDate
    this.localSearchTime = this.initialTime
    this.localSelectedMode = this.initialMode
  },
  methods: {
    backupTime() {
      console.log('backup time')
      this.backupTimeValue = this.localSearchTime
    },
    backupDate() {
      console.log('backup date')
      this.backupDateValue = this.localSearchDate
    },
    restoreTime() {
      console.log('restore time')
      this.localSearchTime = this.backupTimeValue
    },
    restoreDate() {
      console.log('restore date')
      this.localSearchDate = this.backupDateValue
    },
  },
}
</script>

<style lang="scss"></style>
