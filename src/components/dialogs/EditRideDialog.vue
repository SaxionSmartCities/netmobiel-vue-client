<template>
  <v-card>
    <v-card-title class="headline"> Rit Wijzigen </v-card-title>
    <v-card-text v-if="showWarning">
      <v-row class="d-flex flex-column">
        <v-col>
          <p>
            Let op! Je gaat een rit wijzigen die ingevoerd is als reeks. Wat wil
            je wijzigen?
          </p>
          <v-radio-group v-model="rideScopeRadio">
            <v-radio label="Alleen deze rit" value="this" />
            <v-radio
              label="Deze en alle volgende ritten"
              value="this-and-following"
            />
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-column py-2">
        <v-col>
          <v-btn
            large
            rounded
            block
            mb-4
            depressed
            color="button"
            :disabled="rideScopeRadio === null"
            @click="showWarning = false"
          >
            Doorgaan
          </v-btn>
        </v-col>
        <v-col class="pt-0">
          <v-btn
            large
            rounded
            outlined
            block
            mb-4
            depressed
            color="primary"
            @click="onCancel"
          >
            Annuleren
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else>
      <v-row class="d-flex flex-column">
        <v-col>
          <date-time-selector
            v-model="localTravelTime"
            @dateTimeChanged="onDateTimeChanged"
          />
        </v-col>
        <v-col v-if="rideScopeRadio !== 'this'">
          <recurrence-editor
            v-model="recurrence"
            :origin="localTravelTime ? localTravelTime.when : null"
          />
        </v-col>
        <v-col>
          <v-btn large rounded block depressed color="button" @click="onSubmit">
            Wijzigen
          </v-btn>
        </v-col>
        <v-col class="pt-0">
          <v-btn
            large
            rounded
            outlined
            block
            depressed
            color="primary"
            @click="onCancel"
          >
            Annuleren
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import moment from 'moment'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'
import RecurrenceEditor from '@/components/common/RecurrenceEditor.vue'

export default {
  name: 'EditRideDialog',
  components: { DateTimeSelector, RecurrenceEditor },
  props: {
    ride: { type: Object, required: true },
  },
  data() {
    return {
      showWarning: false,
      rideScopeRadio: null,
      recurrence: undefined,
      localTravelTime: { when: null, arriving: false },
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.localTravelTime.arriving = this.ride.arrivalTimePinned
      if (this.localTravelTime.arriving) {
        this.localTravelTime.when = moment(this.ride.arrivalTime)
      } else {
        this.localTravelTime.when = moment(this.ride.departureTime)
      }
      this.recurrence = this.ride.recurrence
      this.showWarning = this.recurrence !== undefined
    },
    onDateTimeChanged(newDateTime) {
      this.localTravelTime.when = newDateTime.when
      this.localTravelTime.arriving = newDateTime.arriving
    },
    onSubmit() {
      this.$emit('save', {
        scope: this.rideScopeRadio,
        travelTime: this.localTravelTime,
        recurrence: this.recurrence,
      })
    },
    onCancel() {
      this.init()
      this.rideScopeRadio = null
      this.$emit('cancel')
    },
  },
}
</script>
