<template>
  <v-card class="pa-3">
    <v-row class="d-flex flex-column">
      <v-col>
        <h2>Rit wijzigen</h2>
      </v-col>
      <v-col>
        <date-time-selector
          v-model="localTravelTime"
          :allowed-dates="allowedDates"
          @dateTimeChanged="onDateTimeChanged"
        />
      </v-col>
      <v-col>
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
        <v-btn large rounded block depressed color="button">
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
          @click="showDialog = false"
        >
          Annuleren
        </v-btn>
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
    this.localTravelTime.arriving = this.ride.arrivalTimePinned
    if (this.localTravelTime.arriving) {
      this.localTravelTime.when = moment(this.ride.arrivalTime)
    } else {
      this.localTravelTime.when = moment(this.ride.departureTime)
    }
    this.recurrence = this.ride.recurrence
  },
  methods: {
    allowedDates(v) {
      return moment(v) >= moment().startOf('day')
    },
    onDateTimeChanged(newDateTime) {
      console.log(newDateTime)
    },
  },
}
</script>
