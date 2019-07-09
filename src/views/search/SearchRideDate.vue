<template>
  <v-container fluid>
    <v-layout column wrap>
      <v-flex>
        <v-subheader id="subheaderDate" class="text-uppercase body-2">
          Datum
        </v-subheader>
      </v-flex>
      <v-flex>
        <v-date-picker
          v-model="date"
          no-title="no-title"
          color="background-orange"
          locale="nl"
          full-width
          :allowed-dates="allowedDates"
        >
        </v-date-picker>
      </v-flex>

      <v-flex>
        <v-subheader id="subheaderTime" class="text-uppercase body-2">
          Tijd
        </v-subheader>
      </v-flex>

      <v-divider />

      <v-flex mt-3>
        <v-layout justify-center>
          <v-flex shrink>
            <v-time-picker v-mode="time" color="blue"></v-time-picker>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex>
        <v-layout align-end justify-center>
          <v-btn class="ma-3" round large block @click="submitForm($event)">
            Bevestig keuze
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  name: 'SearchRideDate',
  data() {
    return {
      date: undefined,
      time: undefined,
    }
  },
  methods: {
    allowedDates: function(val) {
      let today = moment().startOf('day')
      let selected = moment(val)

      return (
        selected.isSameOrAfter(today) &&
        selected.isBefore(today.add(2, 'weeks'))
      )
    },
    submitForm: function(event) {
      var myDate = this.setTime(this.toggle_exclusive)
      event.preventDefault()
      console.log(myDate)
      this.$router.push({ name: 'searchRide' })
      this.$store.commit('setDate', myDate)
    },
  },
}
</script>

<style lang="scss">
.theme--light.v-subheader.text-uppercase.body-2 {
  color: $color-green;
}
</style>
