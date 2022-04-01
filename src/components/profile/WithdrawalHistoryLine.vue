<template>
  <v-row>
    <v-col v-if="showReference" class="caption text-left font-italic shrink">
      {{ withdrawal.orderReference }}
    </v-col>
    <v-col v-if="showTime" class="body-2 text-left text-gray shrink">
      {{ formatTime }}
    </v-col>
    <v-col class="body-2">
      <div v-if="showUser" class="body-2 font-weight-bold shrink">
        {{ withdrawal.account.name }}
      </div>
      <div class="caption">{{ withdrawal.description }}</div>
      <div
        v-if="showCancel && withdrawal.status === 'REQUESTED'"
        @click="$emit('cancel', withdrawal)"
      >
        <v-icon color="info">delete_forever</v-icon>
        <span>Annuleren</span>
      </div>
      <div v-if="withdrawal.reason" class="caption">
        {{ withdrawal.reason }}
      </div>
    </v-col>
    <v-col class="body-2 shrink text-no-wrap font-italic">
      <span v-if="showCredits">
        {{ withdrawal.amountCredits }}
      </span>
      <span>
        {{ amountInEuro }}
      </span>
    </v-col>
    <v-col
      v-if="!showSettling || iconInfo.final"
      class="body-2 text-right shrink text-no-wrap"
    >
      <!--      <span class="">{{ withdrawal.status }}</span>-->
      <v-icon
        v-if="iconInfo"
        :color="iconInfo.iconColor"
        :class="iconInfo.iconClass"
        >{{ iconInfo.iconName }}</v-icon
      >
    </v-col>
    <v-col v-else class="body-2 text-right shrink text-no-wrap">
      <v-radio-group
        v-model="settlement"
        class="my-0 pt-0"
        hide-details
        @change="$emit('status-update', withdrawal, settlement)"
      >
        <v-radio value="COMPLETED">
          <template #label>
            <v-icon
              :color="completedIcon.iconColor"
              :class="completedIcon.iconClass"
              >{{ completedIcon.iconName }}</v-icon
            >
          </template>
        </v-radio>
        <v-radio value="CANCELLED">
          <template #label>
            <v-icon
              :color="cancelledIcon.iconColor"
              :class="cancelledIcon.iconClass"
              >{{ cancelledIcon.iconName }}</v-icon
            >
          </template>
        </v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'
import constants from '@/constants/constants'
import { amountInEuro } from '@/utils/Utils'

export default {
  name: 'WithdrawalHistoryLine',
  props: {
    withdrawal: { type: Object, required: true },
    // The banker user listing the withdrawals
    showUser: { type: Boolean, required: false, default: false },
    showCancel: { type: Boolean, required: false, default: true },
    showCredits: { type: Boolean, required: false, default: true },
    showTime: { type: Boolean, required: false, default: true },
    showReference: { type: Boolean, required: false, default: false },
    showSettling: { type: Boolean, required: false, default: false },
  },
  data: function () {
    return {
      settlement: null,
    }
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
    amountInEuro() {
      return amountInEuro(this.withdrawal.amountEurocents)
    },
    iconInfo() {
      return this.withdrawal
        ? this.lookupIconInfo(this.withdrawal.status)
        : undefined
    },
    completedIcon() {
      return this.lookupIconInfo('COMPLETED')
    },
    cancelledIcon() {
      return this.lookupIconInfo('CANCELLED')
    },
  },
  methods: {
    lookupIconInfo(status) {
      return constants.PAYMENT_STATUS.find((s) => s.status === status)
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
