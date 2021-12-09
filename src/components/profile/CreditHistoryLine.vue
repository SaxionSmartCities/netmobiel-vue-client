<template>
  <v-col>
    <v-row dense>
      <v-col class="body-2 font-weight-medium">
        {{ formatDate }}
      </v-col>
      <v-col class="body-2 align-self-end shrink text-kind">
        {{ transactionKind }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="body-2 align-self-start text-gray shrink">
        {{ formatTime }}
      </v-col>
      <v-col class="body-2">{{ description }}</v-col>
      <v-col class="body-2 align-self-end shrink" :class="transactionColor">
        {{ amountFormat }}
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import moment from 'moment'

const kinds = {
  DEPOSIT: 'storting',
  WITHDRAWAL: 'opname',
  PAYMENT: 'betaling',
  RESERVATION: 'reservering',
  RELEASE: 'vrijgave',
}

export default {
  name: 'CreditHistoryLine',
  props: {
    statement: { type: Object, required: true },
  },
  computed: {
    amountFormat() {
      return (
        (this.statement.type === 'CREDIT' ? '+' : '-') + this.statement.amount
      )
    },
    description() {
      return this.statement.description
    },
    formatDate() {
      let dateString = moment(this.statement.transactionTime)
        .locale('nl')
        .format('dddd D MMMM YYYY')
      return dateString.charAt(0).toUpperCase() + dateString.substring(1)
    },
    formatTime() {
      return moment(this.statement.transactionTime).locale('nl').format('HH:mm')
    },
    transactionColor() {
      return this.statement.type === 'CREDIT' ? 'text-green' : 'text-red'
    },
    transactionKind() {
      return kinds[this.statement.transactionType]
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
.text-kind {
  font-style: italic;
}
</style>
