<template>
  <v-form ref="form" v-model="valid" lazy-validation class="full-height">
    <content-pane>
      <v-row dense>
        <v-col>
          <h1>Uitbetalingsbestand</h1>
        </v-col>
      </v-row>
      <v-row v-if="bankSimulated">
        <v-col>
          <v-alert type="warning">
            In de huidige testfase van de Netmobiel-app kun je nog niet écht
            credits opnemen. Het proces dat je straks doorloopt is identiek,
            echter de 'pennningmeester' laat de credits gewoon verdwijnen.
          </v-alert>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4"> Gewijzigd op </v-col>
        <v-col>
          {{ formatDateTime(paymentBatch.modificationTime) }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4"> Door </v-col>
        <v-col v-if="paymentBatch.modifiedBy">
          {{ paymentBatch.modifiedBy.givenName }}
          {{ paymentBatch.modifiedBy.familyName }}</v-col
        >
      </v-row>
      <v-row dense>
        <v-col cols="4"> Status </v-col>
        <v-col v-if="batchIconInfo">
          {{ batchIconInfo.label }}
          <v-icon
            :color="batchIconInfo.iconColor"
            :class="batchIconInfo.iconClass"
            >{{ batchIconInfo.iconName }}</v-icon
          >
        </v-col>
      </v-row>
      <v-row v-if="paymentBatch && paymentBatch.reason" dense>
        <v-col cols="4"> Toelichting </v-col>
        <v-col> {{ paymentBatch.reason }} </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4"> Aangevraagd </v-col>
        <v-col>
          {{ amountInEuro(paymentBatch.amountRequestedEurocents) }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4"> Goedgekeurd </v-col>
        <v-col>
          {{ amountInEuro(paymentBatch.amountSettledEurocents) }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4"> Ten laste van </v-col>
        <v-col>
          {{ friendlyIBAN(paymentBatch.originatorIban) }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4"> Op naam van </v-col>
        <v-col>
          {{ paymentBatch.originatorIbanHolder }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4"> Referentie </v-col>
        <v-col> {{ paymentBatch.orderReference }} </v-col>
      </v-row>
      <v-row v-if="paymentBatchActive" class="mx-auto">
        <v-col>
          <v-btn
            rounded
            color="button"
            depressed
            :disabled="busyMailing"
            @click="mail()"
          >
            Stuur Betalingsbestand
          </v-btn>
        </v-col>
        <v-col v-if="busyMailing">
          <v-progress-circular indeterminate color="button" />
        </v-col>
      </v-row>
      <v-switch
        v-if="paymentBatchActive"
        v-model="showSettling"
        label="Beoordeel opdrachten"
      ></v-switch>
      <v-row>
        <v-col>
          <h2>Opdrachten</h2>
        </v-col>
      </v-row>
      <v-row v-if="showSettling && paymentBatchActive" dense class="caption">
        <v-col>
          <div>Geef per opdracht aan of deze is geaccepteerd door de bank.</div>
          <div>
            <strong>Let op:</strong> Na opslaan kan de keuze niet meer ongedaan
            worden gemaakt!
          </div>
        </v-col>
      </v-row>
      <withdrawal-history-line
        v-for="(wr, index) in paymentBatch.withdrawalRequests"
        :key="index"
        :index="index"
        :withdrawal="wr"
        :show-user="true"
        :show-cancel="false"
        :show-credits="false"
        :show-time="false"
        :show-reference="true"
        :show-settling="showSettling"
        @status-update="onStatusUpdate"
      ></withdrawal-history-line>
      <v-row>
        <v-col>
          <v-btn
            rounded
            color="primary"
            depressed
            outlined
            block
            @click="cancel()"
          >
            Annuleren
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            rounded
            color="button"
            depressed
            block
            :disabled="!(paymentBatchActive && showSettling)"
            @click="save()"
          >
            Opslaan
          </v-btn>
        </v-col>
      </v-row>
    </content-pane>
  </v-form>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as bsStore from '@/store/banker-service'
import * as uiStore from '@/store/ui'
import config from '@/config/config'
import * as ibantools from 'ibantools'
import moment from 'moment'
import constants from '@/constants/constants'
import WithdrawalHistoryLine from '@/components/profile/WithdrawalHistoryLine'
import { amountInEuro } from '@/utils/Utils'

export default {
  name: 'PaymentBatchPage',
  components: {
    ContentPane,
    WithdrawalHistoryLine,
  },
  props: {
    batchId: { type: String, required: true },
  },
  data: function () {
    return {
      valid: false,
      showSettling: false,
      busyMailing: false,
      bankSimulated: config.BANK_SIMULATED || false,
    }
  },
  computed: {
    paymentBatchActive() {
      return this.paymentBatch.status === 'ACTIVE'
    },
    bankerUser() {
      return bsStore.getters.getBankerUser
    },
    paymentBatch() {
      return bsStore.getters.getPaymentBatch
    },
    batchIconInfo() {
      return constants.PAYMENT_STATUS.find(
        (s) => s.status === this.paymentBatch?.status
      )
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    // Fetch me from the banker service
    bsStore.actions.fetchBankerUser()
    bsStore.actions.fetchSystemAccounts()
    bsStore.actions.fetchPaymentBatch(this.batchId).then(() => {
      this.showSettling = this.paymentBatch.withdrawalRequests
        .map((wr) => wr.status)
        .reduce(
          (prev, status) =>
            prev || status === 'COMPLETED' || status === 'CANCELLED',
          false
        )
    })
  },
  methods: {
    formatDateTime(dt) {
      return dt ? moment(dt).locale('nl').format('DD MMM YYYY HH:mm') : ''
    },
    amountInEuro(amountInEurocents) {
      return amountInEuro(amountInEurocents)
    },
    friendlyIBAN(iban) {
      return iban ? ibantools.friendlyFormatIBAN(iban) : ''
    },
    validate() {
      return this.$refs.form.validate()
    },
    onStatusUpdate(withdrawal, settlement) {
      // console.log(`Withdrawal settlement: ${withdrawal.id} ${settlement}`)
      withdrawal.settlement = settlement
    },
    cancel() {
      this.navToOverview()
    },
    navToOverview() {
      this.$router.push({
        name: 'paymentBatchOverviewPage',
      })
    },
    mail() {
      this.busyMailing = true
      bsStore.actions
        .mailMePaymentBatchCreditTransferXML(this.paymentBatch.id)
        .then((success) => {
          this.busyMailing = false
          if (success) {
            uiStore.actions.queueInfoNotification(
              `Het bestand is verstuurd naar ${this.bankerUser.email}`
            )
          }
        })
    },
    save() {
      const withdrawals = this.paymentBatch.withdrawalRequests
        .filter((wr) => !!wr?.settlement)
        .map((w) => {
          return {
            id: w.id,
            status: w.settlement,
            reason:
              w.settlement === 'CANCELLED'
                ? 'Afgekeurd door beheerder'
                : undefined,
          }
        })
      const batch = {
        id: this.paymentBatch.id,
        withdrawalRequests: withdrawals,
      }
      bsStore.actions.updatePaymentBatch(batch).then(() => {
        this.navToOverview()
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
