<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Uitbetalingen</h1>
        <div class="caption">
          Uitbetalingen worden gedaan via internetbankieren. Door op de knop te
          drukken worden de uitstaande opdrachten in een batchbestand verzameld.
        </div>
      </v-col>
    </v-row>
    <v-row v-if="checkIbanPresent(bankingReserveAccount) === true">
      <v-col>
        <v-btn
          rounded
          outlined
          color="primary"
          :disabled="pendingWithdrawals.length === 0"
          @click="onNewPaymentBatch"
        >
          Nieuwe Uitbetaling
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="text-body-2">
        <span
          v-if="checkIbanPresent(bankingReserveAccount) === true"
          class="caption"
        >
          Ten laste van {{ friendlyIBAN(bankingReserveAccount.iban) }}
          {{ bankingReserveAccount.ibanHolder }}
        </span>
        <div v-else class="red--text">
          <span class="mr-4">Rekeninggegevens zijn onvolledig.</span>
          <v-btn
            :to="getAccountPage"
            large
            rounded
            depressed
            outlined
            color="primary"
          >
            Aanvullen
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="pendingWithdrawals.length === 0">
      <v-col>Er zijn momenteel geen verzoeken tot uitbetaling.</v-col>
    </v-row>
    <grouped-card-list
      v-else
      :items="pendingWithdrawals"
      :get-date="(w) => w.creationTime"
    >
      <template #card="{ item, index }">
        <withdrawal-history-line
          :index="index"
          :withdrawal="item"
          :show-user="true"
          :show-cancel="false"
          @cancel="onCancel(item)"
        ></withdrawal-history-line>
      </template>
    </grouped-card-list>
    <v-row>
      <v-col>
        <h2>Batches</h2>
      </v-col>
    </v-row>
    <v-row
      v-for="(pb, index) in paymentBatches"
      :key="index"
      dense
      class="body-2 text-left text-gray clickable-item"
      @click="onEditPaymentBatch(pb)"
    >
      <v-col>
        {{ formatDateTime(pb.modificationTime) }}
      </v-col>
      <!--      <v-col>-->
      <!--        {{ pb.createdBy.givenName }} {{ pb.createdBy.familyName }}-->
      <!--      </v-col>-->
      <v-col cols="1"> #{{ pb.nrRequests }} </v-col>
      <v-col cols="2"> {{ amountInEuro(pb.amountRequestedEurocents) }} </v-col>
      <v-col cols="2"> {{ amountInEuro(pb.amountSettledEurocents) }} </v-col>
      <v-col class="body-2 text-right shrink text-no-wrap">
        <!--      <span class="">{{ withdrawal.status }}</span>-->
        <v-icon
          v-if="iconInfo(pb.status)"
          :color="iconInfo(pb.status).iconColor"
          :class="iconInfo(pb.status).iconClass"
          >{{ iconInfo(pb.status).iconName }}</v-icon
        >
      </v-col>
    </v-row>
    <v-dialog v-model="showCancelDialog">
      <v-card class="py-1 px-3">
        <v-card-title class="headline">Verwijder Opdracht</v-card-title>
        <v-card-text>
          Wil je de opdracht annuleren om
          {{ withdrawalToCancel && withdrawalToCancel.amountCredits }} credits
          over te maken?
        </v-card-text>
        <v-card-actions class="justify-space-around">
          <v-btn
            large
            rounded
            depressed
            color="button"
            min-width="9em"
            @click="confirmCancellation"
          >
            Verwijderen
          </v-btn>
          <v-btn
            large
            rounded
            outlined
            depressed
            color="primary"
            min-width="9em"
            @click="closeCancelDialog"
          >
            Behouden
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as bsStore from '@/store/banker-service'
import * as uiStore from '@/store/ui'
import GroupedCardList from '@/components/common/GroupedCardList'
import WithdrawalHistoryLine from '@/components/profile/WithdrawalHistoryLine'
import moment from 'moment'
import constants from '@/constants/constants'
import * as ibantools from 'ibantools'
import { amountInEuro } from '@/utils/Utils'

export default {
  name: 'PaymentBatchOverviewPage',
  components: { ContentPane, GroupedCardList, WithdrawalHistoryLine },
  data() {
    return {
      showCancelDialog: false,
      withdrawalToCancel: null,
    }
  },
  computed: {
    pendingWithdrawals() {
      return bsStore.getters.getWithdrawals?.data ?? []
    },
    paymentBatches() {
      return bsStore.getters.getPaymentBatches?.data ?? []
    },
    user() {
      return bsStore.getters.getBankerUser
    },
    bankingReserveAccountNcan() {
      // Name of the system account for the central banking reserve
      return 'banking-reserve'
    },
    bankingReserveAccount() {
      return bsStore.getters.getSystemAccounts?.data.find(
        (acc) => acc.ncan === this.bankingReserveAccountNcan
      )
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchSystemAccounts()
    bsStore.actions.fetchBankerUser()
    bsStore.actions.fetchWithdrawals({ status: 'REQUESTED' })
    bsStore.actions.fetchPaymentBatches()
  },
  methods: {
    formatDateTime(dt) {
      return moment(dt).locale('nl').format('DD-MM-YYYY HH:mm')
    },
    iconInfo(status) {
      return constants.PAYMENT_STATUS.find((s) => s.status === status)
    },
    amountInEuro(amountInEurocents) {
      return amountInEuro(amountInEurocents)
    },
    onCancel(wr) {
      this.withdrawalToCancel = wr
      this.showCancelDialog = true
    },
    confirmCancellation() {
      bsStore.actions
        .cancelUserWithdrawal(this.withdrawalToCancel.urn)
        .then((result) => {
          if (result) {
            this.showCancelDialog = false
            bsStore.actions.fetchUserWithdrawals()
          }
        })
    },
    closeCancelDialog() {
      this.showCancelDialog = false
    },
    onEditPaymentBatch(batch) {
      // Add the batch itself now. The withdrawals are added by the edit page
      bsStore.mutations.setPaymentBatch(batch)
      this.$router.push({
        name: 'editPaymentBatchPage',
        params: { batchId: String(batch.id) },
      })
    },
    onNewPaymentBatch() {
      bsStore.actions.createPaymentBatch().then((location) => {
        if (location) {
          // Add the minimum required attributes, will be replaced in payment page
          bsStore.mutations.setPaymentBatch({ id: 0, withdrawalRequests: [] })
          this.$router.push({
            name: 'editPaymentBatchPage',
            params: { batchId: location },
          })
        }
      })
    },
    friendlyIBAN(iban) {
      return iban ? ibantools.friendlyFormatIBAN(iban) : ''
    },
    checkIbanPresent(account) {
      if (!account) {
        // Temporary issue, don't flash error message
        return false
      }
      return !account.iban
        ? 'Voeg IBAN rekening toe'
        : !account.ibanHolder
        ? 'Voeg naam rekeninghouder toe'
        : true
    },
  },
}
</script>

<style lang="scss" scoped></style>
