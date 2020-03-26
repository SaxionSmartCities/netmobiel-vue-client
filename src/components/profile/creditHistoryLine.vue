<template>
  <v-col class="py-0 my-2">
    <v-row class="py-0 my-0" align="center">
      <v-col class="py-0 my-0"
        ><strong>{{ formatDate }}</strong></v-col
      >
    </v-row>
    <v-row align="center" class="py-0 my-0">
      <v-col class="py-0 my-0" cols="2">{{ formatTime }}</v-col>
      <v-col class="py-0 my-0 text-small">{{ description }}</v-col>
      <v-col class="py-0 my-0" cols="2">{{ transaction.amount }}</v-col>
    </v-row>
  </v-col>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    transaction: { type: Object, required: true },
  },
  computed: {
    amountFormat() {
      let amount = this.transaction.amount
      if (amount > 0) {
        amount = '+' + amount
      }
      return amount
    },
    description() {
      let type = this.transaction.type
      let message = 'Onbekende transactie'
      if (type == 'drive') {
        message =
          'Rit met ' +
          this.transaction.otherParty +
          ' naar ' +
          this.transaction.destinationRide
      } else if (type == 'reward') {
        message = 'Reward verzilverd van ' + this.transaction.otherParty
      } else if (type == 'donation') {
        message = 'Donatie aan ' + this.transaction.otherParty
      }
      return message
    },
    formatDate() {
      let dateString = moment(this.transaction.date)
        .locale('nl')
        .format('dddd D MMMM YYYY')
      let dateUpperString =
        dateString.charAt(0).toUpperCase() + dateString.substring(1)
      return dateUpperString
    },
    formatTime() {
      return moment(this.transaction.date)
        .locale('nl')
        .format('hh:mm')
    },
  },
}
</script>
