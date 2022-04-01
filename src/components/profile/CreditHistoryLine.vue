<template>
  <v-row>
    <v-col class="body-2 text-left text-gray shrink">
      {{ formatTime }}
    </v-col>
    <v-col class="body-2">
      <div>
        <span class="font-weight-bold">{{ counterparty }}</span>
        {{ accountType }}
      </div>
      <div class="caption">{{ description }}</div>
    </v-col>
    <v-col class="body-2 align-self-start shrink text-right">
      <div class="font-italic">{{ transactionKind }} {{ rollbackText }}</div>
      <div :class="transactionColor">{{ amountFormat }}</div>
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'

const kinds = {
  DEPOSIT: 'storting',
  WITHDRAWAL: 'opname',
  PAYMENT: 'betaling',
  REFUND: 'terugbetaling',
  RESERVATION: 'reservering',
  RELEASE: 'vrijgave',
}

export default {
  name: 'CreditHistoryLine',
  props: {
    statement: { type: Object, required: true },
    // The banker user listing the statements
    user: { type: Object, required: false, default: undefined },
    // The account this list is about
    account: { type: Object, required: true },
  },
  computed: {
    amountFormat() {
      const sign =
        (this.statement.type === 'CREDIT' &&
          this.account.type === 'LIABILITY') ||
        (this.statement.type === 'DEBIT' && this.account.type === 'ASSET')
          ? '+'
          : '-'
      return `${sign}${this.statement.amount}`
    },
    description() {
      return this.statement.description
    },
    accountType() {
      let type
      if (this.counterpartyIsMyPremiumAccount) {
        type = 'premie'
      } else if (this.counterpartyIsMyPersonalAccount) {
        type = 'courant'
      }
      return type ? ` (${type})` : ''
    },
    counterparty() {
      return this.statement.counterparty.name
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
    rollbackText() {
      return this.statement.rollback ? '(herstel)' : ''
    },
    counterpartyIsMyPremiumAccount() {
      return this.statement.counterparty.id === this.user?.premiumAccount?.id
    },
    counterpartyIsMyPersonalAccount() {
      return this.statement.counterparty.id === this.user?.personalAccount?.id
    },
    counterpartyIsMe() {
      return (
        this.counterpartyIsMyPersonalAccount ||
        this.counterpartyIsMyPremiumAccount
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.text-gray {
  color: gray;
}
.text-green {
  color: $color-green;
}
.text-red {
  color: $color-alertRed;
}
</style>
