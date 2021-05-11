<template>
  <v-card class="pa-3">
    <v-row class="d-flex flex-column">
      <v-col>
        <h2>Rit wijzigen</h2>
      </v-col>
      <v-card-text v-if="showWarning">
        <p>
          Let op! Je gaat een rit wijzigen die ingevoerd is als reeks. Wat wil
          je wijzigen?
        </p>
        <v-radio-group v-model="rideChoiceRadio">
          <v-radio label="Alleen deze rit" value="single" />
          <v-radio label="Deze en alle volgende ritten" value="sequence" />
        </v-radio-group>
        <v-row>
          <v-col>
            <v-btn
              large
              rounded
              block
              mb-4
              depressed
              color="button"
              :disabled="rideChoiceRadio === null"
              @click="showWarning = false"
            >
              Doorgaan
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
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
      <v-col v-else>
        <v-row class="d-flex flex-column">
          <v-col>
            <date-time-selector
              v-model="localTravelTime"
              :allowed-dates="allowedDates"
              @dateTimeChanged="onDateTimeChanged"
            />
          </v-col>
          <v-col v-if="rideChoiceRadio === 'sequence'">
            <recurrence-editor
              v-model="recurrence"
              :origin="localTravelTime ? localTravelTime.when : null"
            />
          </v-col>
          <!-- <v-col>
            <v-row dense>
              <v-col cols="1">
                <v-icon>directions_car</v-icon>
              </v-col>
              <v-col v-if="!selectedCar" class="pl-3">
                <router-link to="cars">
                  <span>Voer je auto in</span>
                </router-link>
              </v-col>
              <v-col v-else class="pl-3">
                <router-link to="cars">
                  <span> {{ selectedCar.licensePlate }}</span>
                </router-link>
                <div class="car-model">
                  {{ selectedCar.brand }}
                  {{ selectedCar.model }}
                </div>
              </v-col>
            </v-row>
          </v-col> -->
          <v-col>
            <v-btn
              large
              rounded
              block
              depressed
              color="button"
              @click="onSubmit"
            >
              Wijzigen
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
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import moment from 'moment'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'
import RecurrenceEditor from '@/components/common/RecurrenceEditor.vue'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'EditRideDialog',
  components: { DateTimeSelector, RecurrenceEditor },
  props: {
    ride: { type: Object, required: true },
  },
  data() {
    return {
      showWarning: false,
      rideChoiceRadio: null,
      recurrence: undefined,
      localTravelTime: { when: null, arriving: false },
    }
  },
  computed: {
    searchCriteria() {
      return { travelTime: null }
    },
    selectedCar() {
      return this.ride.car
    },
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
    allowedDates(v) {
      return moment(v) >= moment().startOf('day')
    },
    onDateTimeChanged(newDateTime) {
      this.localTravelTime.when = newDateTime.when
      this.localTravelTime.arriving = newDateTime.arriving
    },
    onSubmit() {
      this.$emit('save', {
        choice: this.rideChoiceRadio,
        travelTime: this.localTravelTime,
        recurrence: this.recurrence,
      })
    },
    onCancel() {
      this.init()
      this.rideChoiceRadio = null
      this.$emit('cancel')
    },
  },
}
</script>
