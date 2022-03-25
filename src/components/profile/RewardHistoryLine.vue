<template>
  <v-row>
    <v-col class="body-2 text-left text-gray shrink">
      {{ formatTime }}
    </v-col>
    <v-col class="body-2">
      <div v-if="showUser" class="body-2 font-weight-bold shrink">
        {{ name }}
      </div>
      <div>{{ reward.incentive.description }}</div>
    </v-col>
    <v-col class="body-2 shrink">
      <span class="font-italic">
        {{ !reward.incentive.redemption ? 'Verzilvering' : 'Gift' }}
      </span>
    </v-col>
    <v-col class="body-2 text-right shrink text-no-wrap">
      <span class="text-green mr-2">{{ reward.amount }}</span>
      <v-icon v-if="reward.paidOut" class="text-green">check</v-icon>
      <v-icon v-else class="text-red">alarm</v-icon>
    </v-col>
  </v-row>
</template>
<script>
import moment from 'moment'

export default {
  name: 'RewardHistoryLine',
  props: {
    reward: { type: Object, required: true },
    // The banker user listing the rewards
    showUser: { type: Boolean, required: false, default: false },
  },
  computed: {
    description() {
      return this.reward.description
    },
    formatTime() {
      return moment(this.reward.rewardTime).locale('nl').format('HH:mm')
    },
    transactionKind() {
      return this.reward.redemption ? 'Verzilvering' : 'Gift'
    },
    name() {
      return this.reward.recipient
        ? `${this.reward.recipient.givenName} ${this.reward.recipient.familyName}`
        : ''
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
