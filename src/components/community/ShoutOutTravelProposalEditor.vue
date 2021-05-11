<template>
  <v-row class="bg-light-green pt-0">
    <v-col cols="3">
      <v-dialog v-model="showTimePicker" persistent>
        <template v-slot:activator="{ on }">
          <v-text-field
            class="bg-white"
            dense
            hide-details
            outlined
            readonly
            label="Vertrek"
            :value="pickedTime"
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
    <v-col cols="9">
      <v-text-field
        class="bg-white"
        dense
        hide-details
        outlined
        readonly
        label="Van"
        :value="departureLabel"
        append-icon="close"
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
    time: { type: Object, required: true },
    location: { type: Object, required: true },
    allowedMinutes: { type: Function, default: m => m % 5 == 0 },
  },
  data() {
    return {
      showTimePicker: false,
      pickedTime: '',
    }
  },
  computed: {
    departureLabel() {
      return this.location?.label || 'Onbekende locatie'
    },
  },
  mounted() {
    if (this.time !== null) {
      this.pickedTime = this.time.format('HH:mm')
    }
  },
  methods: {
    onConfirmTime() {
      this.showTimePicker = false
      const depart = moment(this.time)
      const timestamp = `${depart.format(DATE_FORMAT_PICKER)} ${
        this.pickedTime
      }`
      this.$emit('updateProposal', {
        time: timestamp,
        location: this.location,
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
