<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Gemachtigden</h1>
        <p>Wie kunnen namens jou de app gebruiken?</p>
        <p class="caption">
          Gebruikers van Netmobiel kunnen op aanvraag een rol als mantelzorger
          verkrijgen. Elke cliënt van de mantelzorger moet altijd eenmalig
          persoonlijk toestemming geven door een code uit een SMS bericht door
          te geven aan de beoogde mantelzorger.
        </p>
      </v-col>
    </v-row>
    <generic-list
      :items="delegations.data"
      empty-list-label="Momenteel kan niemand de app gebruiken in jouw naam."
    >
      <template #list-item="{ item }">
        <delegation-item
          :delegation="item"
          :show-delegators="false"
          @remove="onDelegationDelete"
        />
      </template>
    </generic-list>
    <v-dialog v-model="delegationRemovalDialog" max-width="400">
      <v-card class="py-1 px-3">
        <v-card-title class="headline">Machtiging verwijderen</v-card-title>
        <v-card-text>
          Wil je de machtiging aan
          <strong>
            {{ selectedDelegateName }}
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
import GenericList from '@/components/lists/GenericList'
import DelegationItem from '@/components/profile/DelegationItem.vue'

export default {
  name: 'DelegateOverviewPage',
  components: { ContentPane, GenericList, DelegationItem },
  data() {
    return {
      activeDelegation: null,
      delegationRemovalDialog: false,
    }
  },
  computed: {
    myProfile() {
      return psStore.getters.getProfile
    },
    delegations() {
      return psStore.getters.getDelegations
    },
    selectedDelegateName() {
      const delegate = this.activeDelegation?.delegate
      return `${delegate?.firstName ?? ''} ${delegate?.lastName ?? ''}`.trim()
    },
  },
  mounted() {
    uiStore.mutations.showBackButton()
    this.refreshDelegationList()
  },
  methods: {
    refreshDelegationList() {
      psStore.actions.fetchDelegations({ delegatorId: this.myProfile?.id })
    },
    onDelegationDelete(delegation) {
      this.activeDelegation = delegation
      this.delegationRemovalDialog = true
    },
    removeDelegation() {
      this.delegationRemovalDialog = false
      if (this.activeDelegation) {
        psStore.actions
          .deleteDelegation(this.activeDelegation.id)
          .then((success) => {
            if (success) {
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
