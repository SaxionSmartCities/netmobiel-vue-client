<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Machtigingen</h1>
        <span>Namens wie wil je de app gebruiken?</span>
      </v-col>
    </v-row>
    <v-row
      v-if="delegatorId != null && delegator != null"
      class="primary-border mb-3"
    >
      <v-col>
        <span>
          Je gebruikt de app nu namens
          <strong>{{ delegator.firstName }} {{ delegator.lastName }}</strong>
        </span>
      </v-col>
      <v-col class="shrink">
        <v-btn small rounded depressed color="button" @click="onStopDelegation">
          Stoppen
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="pb-0">
      <v-col>
        <h4 class="text-primary">Account</h4>
      </v-col>
      <v-col>
        <v-btn
          small
          rounded
          block
          outlined
          color="primary"
          :disabled="delegatorId != null"
          to="/delegators/add"
        >
          Aanvragen
        </v-btn>
      </v-col>
    </v-row>
    <generic-list
      :items="delegations.data"
      empty-list-label="Je beheert op dit moment geen accounts van andere gebruikers."
    >
      <template #list-item="{ item }">
        <delegation-item
          :delegation="item"
          :selected="item.delegator.id === delegatorId"
          :show-delegators="true"
          @select="onDelegationSelected"
          @resend-code="onResendCode"
          @remove="onDelegationDelete"
          @activate="onActivate"
        />
      </template>
    </generic-list>
    <v-dialog v-model="activationDialog" max-width="400">
      <v-card class="py-1 px-3">
        <v-card-title class="headline">Machtiging activeren</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="py-1">
              Voer de code in die je hebt gekregen van
              <strong>
                {{ selectedDelegatorName }}
              </strong>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="activationCode"
                autofocus
                hide-details="auto"
                counter="6"
                outlined
                label="Activatiecode"
                :error-messages="activationCodeErrorMessage"
                class="text-h4"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            rounded
            outlined
            color="primary"
            @click="activationDialog = false"
          >
            Annuleren
          </v-btn>
          <v-btn rounded depressed color="button" @click="activate()">
            Activeren
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="delegationRemovalDialog" max-width="400">
      <v-card class="py-1 px-3">
        <v-card-title class="headline">Machtiging verwijderen</v-card-title>
        <v-card-text
          v-if="activeDelegation && activeDelegation.activationTime == null"
        >
          Wil je je machtigingsaanvraag aan
          <strong>
            {{ selectedDelegatorName }}
          </strong>
          intrekken?
        </v-card-text>
        <v-card-text v-else>
          Wil je je machtiging van
          <strong>
            {{ selectedDelegatorName }}
          </strong>
          beëindigen?
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            rounded
            outlined
            color="primary"
            @click="delegationRemovalDialog = false"
          >
            Annuleren
          </v-btn>
          <v-btn rounded depressed color="button" @click="removeDelegation()">
            Verwijderen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as msStore from '@/store/message-service'
import GenericList from '@/components/lists/GenericList'
import DelegationItem from '@/components/profile/DelegationItem.vue'
import * as localStorageHelper from '@/utils/localStorageHelper'
import constants from '@/constants/constants'

export default {
  name: 'DelegatorOverviewPage',
  components: { ContentPane, GenericList, DelegationItem },
  data() {
    return {
      activationDialog: false,
      activeDelegation: null,
      activationCode: '',
      activationCodeErrorMessage: null,
      delegationRemovalDialog: false,
    }
  },
  computed: {
    delegate() {
      return psStore.getters.getDelegateProfile ?? psStore.getters.getProfile
    },
    delegations() {
      return psStore.getters.getDelegations
    },
    delegatorId() {
      return psStore.getters.getDelegatorId
    },
    delegator() {
      const d = this.delegations.data.find(
        (a) => a.delegator.id === this.delegatorId
      )
      return d?.delegator
    },
    selectedDelegatorName() {
      const delegator = this.activeDelegation?.delegator
      return `${delegator?.firstName ?? ''} ${delegator?.lastName ?? ''}`.trim()
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
    this.refreshDelegationList()
  },
  methods: {
    refreshGUI() {
      psStore.actions.fetchMyProfile()
      msStore.actions.fetchMyStatus()
    },
    refreshDelegationList() {
      const delegateId = this.delegate.id
      // We cannot use 'me', we want the delegate's identity
      psStore.actions.fetchDelegations({ delegateId })
    },
    onStopDelegation() {
      psStore.actions.flushSessionLog()
      psStore.mutations.resetDelegate()
      localStorageHelper.clearValue(constants.STORAGE_KEY_DELEGATOR_ID)
      this.refreshGUI()
    },
    onDelegationSelected(delegation) {
      if (this.delegatorId !== delegation.delegator.id) {
        psStore.actions.flushSessionLog()
        psStore.actions.switchProfile({ delegatorId: delegation.delegator.id })
        localStorageHelper.setValue(
          constants.STORAGE_KEY_DELEGATOR_ID,
          delegation.delegator.id
        )
        this.refreshGUI()
      }
    },
    onResendCode(delegation) {
      psStore.actions
        .repeatRequestDelegation(delegation.id)
        .then(() => this.refreshDelegationList())
    },
    onDelegationDelete(delegation) {
      this.activeDelegation = delegation
      this.delegationRemovalDialog = true
    },
    onActivate(delegation) {
      this.activeDelegation = delegation
      this.activationDialog = true
      this.activationCode = ''
      this.activationCodeErrorMessage = null
    },
    activate() {
      if (!this.activationCode) {
        this.activationCodeErrorMessage = 'Veld is verplicht'
      } else if (this.activationCode.length !== 6) {
        this.activationCodeErrorMessage = 'De code bestaat uit 6 cijfers'
      } else {
        this.activationDialog = false
        this.activationCodeErrorMessage = null
        psStore.actions
          .activateDelegation({
            delegationId: this.activeDelegation.id,
            activationCode: this.activationCode,
          })
          .then(() => {
            // Refresh the keycloak access token (it contains the delegator list)
            this.$keycloak.keycloak
              .updateToken(-1)
              .then(() => this.refreshDelegationList())
          })
      }
    },
    removeDelegation() {
      this.delegationRemovalDialog = false
      if (this.activeDelegation) {
        psStore.actions
          .deleteDelegation(this.activeDelegation.id)
          .then((success) => {
            if (success) {
              this.$keycloak.keycloak.updateToken(-1)
              this.refreshDelegationList()
            }
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.text-primary {
  color: $color-primary !important;
}

.primary-border {
  background-color: #2e899720;
  border: 1px solid $color-primary;
  border-radius: 10px;
}
</style>
