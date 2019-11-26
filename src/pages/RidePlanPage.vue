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
                    <date-time-selector />
                  </v-flex>
                </v-layout>
                <v-layout mt-2 justify-center text-xs-center>
                  <v-flex>
                    <v-btn
                      large
                      rounded
                      block
                      :disabled="!locationsPickedCheck"
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

export default {
  name: 'RidePlanPage',
  components: {
    FromToFields,
    DateTimeSelector,
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

    locationsPickedCheck: function() {
      const fromLoc = this.$store.getters['gs/getPickedLocation'].from
      const toLoc = this.$store.getters['gs/getPickedLocation'].to

      return fromLoc.title !== undefined && toLoc.title !== undefined
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
  methods: {
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
      let pickedGeoLocations = this.$store.getters['gs/getPickedLocation']
      let from = pickedGeoLocations.from
      let to = pickedGeoLocations.to
      let ridePlanOptions = this.$store.getters['ps/getProfile'].ridePlanOptions
      let selectedTime = moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm')
      let rideDetails = {
        from: from,
        to: to,
        ridePlanOptions: ridePlanOptions,
        selectedTime: selectedTime,
      }
      this.$store.dispatch('cs/submitRide', rideDetails)
      this.$router.push('/planSubmitted')
    },
  },
}
</script>

<style lang="scss"></style>
