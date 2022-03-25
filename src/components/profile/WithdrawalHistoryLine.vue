<template>
  <v-row>
    <v-col class="body-2 text-left text-gray shrink">
      {{ formatTime }}
    </v-col>
    <v-col class="body-2">
      <div v-if="showUser" class="body-2 font-weight-bold shrink">
        {{ name }}
      </div>
      <div>{{ withdrawal.description }}</div>
      <div
        v-if="withdrawal.status === 'REQUESTED'"
        @click="$emit('cancel', withdrawal)"
      >
        <v-icon color="info">delete_forever</v-icon>
        <span>Annuleren</span>
      </div>
      <div v-if="withdrawal.reason">Geannuleerd: {{ withdrawal.reason }}</div>
    </v-col>
    <v-col class="body-2 shrink">
      <span class="font-italic text-no-wrap">
        {{ withdrawal.amountCredits }} ({{ amountInEuro }})
      </span>
    </v-col>
    <v-col class="body-2 text-right shrink text-no-wrap">
      <!--      <span class="">{{ withdrawal.status }}</span>-->
      <v-icon
        v-if="iconInfo"
        :color="iconInfo.iconColor"
        :class="iconInfo.iconClass"
        >{{ iconInfo.iconName }}</v-icon
      >
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'
import constants from '@/constants/constants'

const euroFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
})

export default {
  name: 'WithdrawalHistoryLine',
  props: {
    withdrawal: { type: Object, required: true },
    // The banker user listing the withdrawals
    showUser: { type: Boolean, required: false, default: false },
  },
  computed: {
    description() {
      return this.withdrawal.description
    },
    formatTime() {
      return moment(this.withdrawal.creationTime).locale('nl').format('HH:mm')
    },
    transactionKind() {
      return this.withdrawal.redemption ? 'Verzilvering' : 'Gift'
    },
    name() {
      return this.withdrawal.recipient
        ? `${this.withdrawal.recipient.givenName} ${this.withdrawal.recipient.familyName}`
        : ''
    },
    amountInEuro() {
      return euroFormatter.format(this.withdrawal.amountEurocents / 100)
    },
    iconInfo() {
      return this.withdrawal
        ? constants.PAYMENT_STATUS.find(
            (s) => s.status === this.withdrawal.status
          )
        : undefined
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
  color: #d0021b;
}
.text-kind {
  font-style: italic;
}
</style>
