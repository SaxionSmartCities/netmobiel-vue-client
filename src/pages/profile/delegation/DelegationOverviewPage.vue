<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Machtigingen</h1>
        <span>Namens wie wil je de app gebruiken?</span>
      </v-col>
    </v-row>
    <v-row v-if="delegatorId != null" class="primary-border mb-3">
      <v-col>
        <span>
          Je gebruikt de app nu namens
          <em>{{ delegator.firstName }} {{ delegator.lastName }}</em>
        </span>
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
          @click="addDelegation"
        >
          Toevoegen
        </v-btn>
      </v-col>
    </v-row>
    <delegator-list
      :delegations="delegations.data"
      :selected-id="delegatorId"
      @AccountSelected="onAccountSelected"
      @DelegationDelete="onDelegationDelete"
      @activate-delegation="onActivate"
    />
    <v-dialog v-model="activationDialog" max-width="400">
      <v-card class="py-1 px-3">
        <v-card-title class="headline">Activeer Machtiging</v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="py-1">
              Voer de code in die je hebt gekregen van
              <strong>
                {{ activeDelegation && activeDelegation.delegator.firstName }}
                {{ activeDelegation && activeDelegation.delegator.lastName }}
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
        <v-card-title class="headline">Machtiging Verwijderen</v-card-title>
        <v-card-text>
          Wil je je machtiging van
          <strong>
            {{ activeDelegation && activeDelegation.delegator.firstName }}
            {{ activeDelegation && activeDelegation.delegator.lastName }}
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
import DelegatorList from '@/components/lists/DelegatorList'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

export default {
  name: 'DelegationOverviewPage',
  components: { ContentPane, DelegatorList },
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
      return d.delegator
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
    const delegateId = this.delegateId()
    psStore.actions.fetchDelegations({ delegateId })
  },
  methods: {
    delegateId() {
      //FIXME Unclear semantics
      const delegateId = psStore.getters.getProfile.id
      const delegateProfile = psStore.getters.getDelegateProfile
      // Check if we have a delegateProfile, if so then return this id.
      // This is the case when the delegate is 'impersonating' a delegator.
      if (delegateProfile) {
        return delegateProfile.id
      }
      return delegateId
    },
    addDelegation() {
      this.$router.push('/profile/delegate/add')
    },
    onAccountSelected(delegatorId) {
      const delegateId = psStore.getters.getDelegateProfile?.id
      if (delegatorId === delegateId) {
        psStore.mutations.resetDelegate()
      } else {
        psStore.actions.switchProfile({ delegatorId })
      }
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
        psStore.actions.activateDelegation({
          delegationId: this.activeDelegation.id,
          activationCode: this.activationCode,
        })
      }
    },
    removeDelegation() {
      this.delegationRemovalDialog = false
      if (this.activeDelegation) {
        const delegateId = this.delegateId()
        psStore.actions
          .deleteDelegation(this.activeDelegation.id)
          .then((success) => {
            if (success) {
              // refresh delegations
              psStore.actions.fetchDelegations({ delegateId })
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
