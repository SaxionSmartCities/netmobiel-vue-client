<template>
  <v-row class="bg-light-green">
    <v-col cols="4">
      <v-dialog v-model="showTimePicker" persistent>
        <template #activator="{ on }">
          <v-text-field
            class="bg-white"
            dense
            hide-details
            outlined
            readonly
            :disabled="!isEnabled"
            :label="timeFieldLabel"
            :value="timeLabel"
            v-on="on"
          />
        </template>
        <v-card>
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
            <v-btn text color="primary" @click="showTimePicker = false">
              Annuleren
            </v-btn>
            <v-btn
              text
              color="primary"
              :disabled="!pickedTime"
              @click="onConfirmTime"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col cols="8">
      <v-text-field
        class="bg-white"
        dense
        hide-details
        outlined
        readonly
        :disabled="!isEnabled"
        :label="locationFieldLabel"
        :value="locationLabel"
        :append-icon="appendIcon"
        @click:append="onLocationReset"
        @click="onLocationUpdate"
      />
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import { DATE_FORMAT_PICKER } from '@/utils/datetime.js'

export default {
  name: 'ShoutOutTravelProposalEditor',
  props: {
    // The time prop should be a moment object.
    time: { type: Object, required: false, default: () => null },
    location: { type: Object, required: false, default: () => null },
    defaultLocation: { type: Object, required: false, default: () => null },
    allowedMinutes: { type: Function, default: (m) => m % 5 === 0 },
    isArrival: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true },
  },
  data() {
    return {
      showTimePicker: false,
      pickedTime: '',
    }
  },
  computed: {
    locationLabel() {
      return this.location?.label || 'Onbekende locatie'
    },
    locationFieldLabel() {
      return this.isArrival ? 'Naar' : 'Van'
    },
    timeFieldLabel() {
      return this.isArrival ? 'Aankomst' : 'Vertrek'
    },
    timeLabel() {
      return this.pickedTime
    },
    appendIcon() {
      return this.location !== this.defaultLocation ? 'close' : undefined
    },
  },
  watch: {
    /**
     * Update the time displayed whenever the input time changes.
     * This does not interfere with the value set by the time editor.
     */
    time() {
      this.refreshPickedTime()
    },
  },
  mounted() {
    this.refreshPickedTime()
  },
  methods: {
    refreshPickedTime() {
      if (this.time) {
        this.pickedTime = this.time.format('HH:mm')
      }
    },
    onConfirmTime() {
      this.showTimePicker = false
      // Combine the selected time with the original (!) input date
      //TODO Handle edge case around midnight departure and arrival next day
      const timestamp = `${this.time.format(DATE_FORMAT_PICKER)} ${
        this.pickedTime
      }`
      this.$emit('updateTravelTime', {
        when: moment(timestamp),
        arriving: this.isArrival,
      })
    },
    onLocationReset() {
      this.$emit('locationReset')
    },
    onLocationUpdate() {
      this.$emit('locationUpdate')
    },
  },
}
</script>

<style lang="scss" scoped>
.bg-light-green {
  background-color: $background-light-green;
}
</style>
