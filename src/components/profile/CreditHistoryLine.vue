<template>
  <v-col class="py-0 my-3 ">
    <v-row class="py-0 my-0" align="center">
      <v-col class="pa-0 pb-2 my-0 body-2 font-weight-medium">
        {{ formatDate }}
      </v-col>
    </v-row>
    <v-row align="center" class="py-0 my-0">
      <v-col class="pa-0 my-0 body-2 align-self-start text-gray shrink mr-2">
        {{ formatTime }}
      </v-col>
      <v-col class="pa-0 my-0 body-2">{{ description }}</v-col>
      <v-col
        class="pa-0 my-0 body-2 align-self-end shrink"
        :class="transactionColor"
      >
        {{ amountFormat }}
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import moment from 'moment'

export default {
  name: 'CreditHistoryLine',
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
      const type = this.transaction.type
      let message = 'Onbekende transactie'
      if (type === 'drive') {
        message =
          'Rit met ' +
          this.transaction.otherParty +
          ' naar ' +
          this.transaction.destinationRide
      } else if (type === 'reward') {
        message = 'Reward uitgezocht van ' + this.transaction.otherParty
      } else if (type === 'donation') {
        message = 'Donatie aan ' + this.transaction.otherParty
      } else if (type === 'addedCredits') {
        message = 'Credits opgewaardeerd'
      }
      return message
    },
    formatDate() {
      let dateString = moment(this.transaction.date)
        .locale('nl')
        .format('dddd D MMMM YYYY')
      return dateString.charAt(0).toUpperCase() + dateString.substring(1)
    },
    formatTime() {
      return moment(this.transaction.date)
        .locale('nl')
        .format('hh:mm')
    },
    transactionColor() {
      if (this.transaction.amount > 0) {
        return 'text-green'
      } else {
        return 'text-red'
      }
    },
  },
}
</script>
<style>
.text-gray {
  color: gray;
}
.text-green {
  color: #2e8997;
}
.text-red {
  color: #d0021b;
}
</style>
