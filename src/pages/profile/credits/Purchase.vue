<template>
  <content-pane>
    <v-row align="center">
      <v-col class="px-0">
        <h3>Credits inkopen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row>
      <v-col>
        U kunt Netmobiel credits inkopen mbv iDEAL.<br />
        Eén credit kost {{ CREDIT_IN_EUROCENTS }} eurocent.
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        Hoeveel credits wilt U inkopen?
      </v-col>
      <v-col>
        <v-text-field
          v-model.number="creditAmount"
          class="border-radius-input"
          single-line
          :min="MIN_AMOUNT"
          :max="MAX_AMOUNT"
          type="number"
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col class="px-0">
        <v-btn
          large
          rounded
          block
          depressed
          :disable="!isValidAmount"
          color="button"
          @click="startMoneyTransfer()"
        >
          Betaal met iDEAL
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as crsStore from '@/store/credits-service'
import * as uiStore from '@/store/ui'

const MIN_AMOUNT = 10,
  MAX_AMOUNT = 1000

export default {
  name: 'Purchase',
  components: {
    ContentPane,
  },
  data: function() {
    return {
      creditAmount: MIN_AMOUNT,
    }
  },
  computed: {
    isValidAmount() {
      const { creditAmount } = this
      return creditAmount >= MIN_AMOUNT && creditAmount <= MAX_AMOUNT
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    this.MIN_AMOUNT = MIN_AMOUNT
    this.MAX_AMOUNT = MAX_AMOUNT
    this.CREDIT_IN_EUROCENTS =
      crsStore.getters.getBankerSettings?.exchangeRate ?? 0
  },
  methods: {
    startMoneyTransfer() {
      const deposit = {
        description: `${this.creditAmount} credits inkopen voor NetMobiel`,
        amountCredits: this.creditAmount,
        returnUrl: new URL('returnAfterDeposit', location.href),
      }
      crsStore.actions.buyCredits(deposit).then(data => {
        // follow payment URL in current window
        location = data.paymentUrl
      })
    },
  },
}
</script>
<style lang="scss"></style>
