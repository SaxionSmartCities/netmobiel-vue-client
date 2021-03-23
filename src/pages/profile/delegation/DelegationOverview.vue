<template>
  <content-pane>
    <v-row>
      <v-col>
        <h4>Account beheer</h4>
        <p>
          Namens wie wil je de app gebruiken?
        </p>
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
    <user-list :users="accounts" />
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
  },
  mounted() {
    uiStore.mutations.showBackButton()
    const delegateId = psStore.getters.getProfile.id
    psStore.actions.fetchDelegations({ delegateId })
  },
  methods: {
    addDelegation() {
      // eslint-disable-next-line
      console.log('TODO: Implement add delegation')
    },
  },
}
</script>

<style lang="scss" scoped>
.text-primary {
  color: $color-primary !important;
}
</style>
