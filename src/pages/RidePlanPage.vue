<template>
  <v-container
    align-center
    justify-center
    fill-height
    fluid
    grid-list-lg
    class="background-primary"
  >
    <v-layout justify-center align-center>
      <v-flex xs11 sm9 md6>
        <v-layout column shrink>
          <v-flex class="box-widget background-white">
            <v-flex>
              <v-form>
                <v-layout column>
                  <v-flex text-xs-center xs12>
                    <h1>Waar rijd je heen?</h1>
                  </v-flex>
                  <v-flex>
                    <from-to-fields />
                  </v-flex>
                  <v-flex>
                    <!-- TODO: Use v-model to update JS object with { datetime: Date object, departure: boolean } -->
                    <date-time-selector
                      @dateValueUpdated="dateChanged"
                      @timeValueUpdated="timeChanged"
                      @modeValueUpdated="modeChanged"
                    />
                  </v-flex>
                  <v-flex>
                    <recurrence-editor
                      v-model="recurrence"
                      :origin="selectedDate"
                    />
                  </v-flex>
                </v-layout>
                <v-layout mt-2 justify-center text-xs-center>
                  <v-flex>
                    <v-btn
                      large
                      rounded
                      block
                      color="button"
                      :disabled="disabledRideAddition()"
                      @click="submitForm()"
                    >
                      Voeg rit toe!
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-layout mt-2 justify-center>
                  <v-flex
                    shrink
                    transition="slide-x-transition"
                    @click="toRidePlanOptions()"
                  >
                    <v-icon>settings</v-icon>
                    <span class="ml-1">Riteigenschappen</span>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import FromToFields from '@/components/common/FromToFields.vue'
import DateTimeSelector from '@/components/common/DateTimeSelector.vue'
import RecurrenceEditor from '@/components/common/RecurrenceEditor.vue'

export default {
  name: 'RidePlanPage',
  components: {
    FromToFields,
    DateTimeSelector,
    RecurrenceEditor,
  },
  data() {
    return {
      selectedDate: undefined,
      selectedTime: undefined,
      selectedMode: undefined,
      recurrence: undefined,
    }
  },
  computed: {
    date: {
      get: function() {
        return this.$store.getters['ui/getTempValue']('rideDate')
      },
      set: function(value) {
        this.$store.commit('ui/setTempValue', { rideDate: value })
      },
    },
    time: {
      get: function() {
        return this.$store.getters['ui/getTempValue']('rideTime')
      },
      set: function(value) {
        this.$store.commit('ui/setTempValue', { rideTime: value })
      },
    },
    fromLocationLabel() {
      const suggestion = this.$store.getters['gs/getPickedLocation'].from
      return !suggestion.title
        ? 'Klik hier voor vertrekplek'
        : `${suggestion.title} ${suggestion.vicinity}`
    },
    toLocationLabel() {
      const suggestion = this.$store.getters['gs/getPickedLocation'].to
      return !suggestion.title
        ? 'Klik hier voor bestemming'
        : `${suggestion.title} ${suggestion.vicinity}`
    },
  },
  mounted() {
    this.$store.commit('ui/clearTempValue')
  },
  methods: {
    dateChanged(value) {
      this.selectedDate = value
    },
    timeChanged(value) {
      this.selectedTime = value
    },
    modeChanged(value) {
      this.selectedMode = value
    },
    disabledRideAddition() {
      const { from, to } = this.$store.getters['gs/getPickedLocation']
      return (
        !from.title || !to.title || !this.selectedDate || !this.selectedTime
      )
    },
    swapLocations() {
      this.$store.commit('gs/swapLocations')
    },
    toLocationSuggestionsPage(field) {
      this.$router.push({ name: 'searchLocation', params: { field: field } })
    },
    toRidePlanOptions() {
      this.$router.push('/planOptions')
    },
    submitForm() {
      const { from, to } = this.$store.getters['gs/getPickedLocation'],
        departure = moment(
          this.selectedDate + ' ' + this.selectedTime,
          'YYYY-MM-DDTHH:mm:ss'
        )
      this.$store.dispatch('cs/submitRide', {
        from,
        to,
        ridePlanOptions: this.$store.getters['ps/getProfile'].ridePlanOptions,
        recurrence: this.recurrence,
        selectedTime: departure,
      })
      this.$router.push('/planSubmitted')
    },
  },
}
</script>

<style lang="scss"></style>
