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
          <v-btn text color="primary" @click="dateModal = false">
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="
              saveDate(date)
              dateModal = false
            "
          >
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
    allowedDates: {
      type: Function,
      required: false,
      default: () => true,
    },
  },
  data: function() {
    return {
      selectedMode: 0,
      dateModal: false,
      timeModal: false,
    }
  },
  computed: {
    date: {
      get: function() {
        return this.$store.getters['ui/getTempValue']('searchDate')
      },
      set: function(value) {
        this.$store.commit('ui/setTempValue', { searchDate: value })
      },
    },
    time: {
      get: function() {
        return this.$store.getters['ui/getTempValue']('searchTime')
      },
      set: function(value) {
        this.$store.commit('ui/setTempValue', { searchTime: value })
      },
    },
  },
  methods: {
    saveDate(date) {
      this.date = date
    },
  },
}
</script>

<style lang="scss"></style>
