<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Account beheer</h3>
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
          @click="addDelegation"
        >
          Toevoegen
        </v-btn>
      </v-col>
    </v-row>
    <user-list
      :users="accounts"
      :selected-id="delegatorId"
      @AccountSelected="onAccountSelected"
      @DelegationDelete="onDelegationDelete"
    />
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import UserList from '@/components/lists/UserList'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'

export default {
  name: 'DelegationOverview',
  components: { ContentPane, UserList },
  computed: {
    accounts() {
      return psStore.getters.getDelegations
    },
    delegatorId() {
      return psStore.getters.getDelegatorId
    },
    delegator() {
      const d = this.accounts.find(a => a.delegator.id === this.delegatorId)
      return d.delegator
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
    let delegateId = psStore.getters.getProfile.id
    const delegateProfile = psStore.getters.getDelegateProfile
    if (delegateProfile) {
      delegateId = delegateProfile.id
    }
    // Check if we have a delegateProfile
    psStore.actions.fetchDelegations({ delegateId })
  },
  methods: {
    addDelegation() {
      this.$router.push('/profile/delegate/new')
    },
    onAccountSelected(delegatorId) {
      const delegateId = psStore.getters.getDelegateProfile?.id
      if (delegatorId === delegateId) {
        psStore.mutations.resetDelegate()
      } else {
        psStore.actions.switchProfile({ delegatorId })
      }
    },
    onDelegationDelete(delegationId) {
      psStore.actions.deleteDelegation({ delegationId })
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
