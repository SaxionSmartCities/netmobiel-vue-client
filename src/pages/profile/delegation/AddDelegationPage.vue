<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Machtiging aanvragen</h1>
        <span>Zoek naar een bestaand account om te beheren</span>
        <span v-if="isAccountCreationEnabled">of maak een nieuwe aan</span>.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="text-primary">Zoek bestaand account</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-text-field
          v-model="search"
          clearable
          hide-details
          outlined
          required
          label="Naam/ Telefoon / Email"
          @click:clear="clearSearchInput"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="showResults">
      <v-col>
        <h4 class="text-primary">Resultaten</h4>
      </v-col>
    </v-row>
    <generic-list
      v-if="showResults"
      :items="searchResults"
      class="mr-4"
      empty-list-label="Geen accounts gevonden"
    >
      <template #list-item="{ item }">
        <account-item
          :account="item"
          :managed="item.managed"
          @select="onSelectAccount"
        />
      </template>
    </generic-list>
    <v-row v-else-if="isAccountCreationEnabled">
      <v-col>
        <v-divider class="pb-4" />
        <v-btn
          rounded
          block
          outlined
          color="primary"
          to="/profile/delegate/new"
        >
          Nieuw account toevoegen
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="delegationRequestDialog" max-width="400">
      <v-card class="py-1 px-3">
        <v-card-title class="headline">Machtiging Aanvragen</v-card-title>
        <v-card-text v-if="selectedAccount">
          Wil je een machtiging vragen aan
          <strong>
            {{ selectedAccount.firstName }}
            {{ selectedAccount.lastName }}
          </strong>
          ? Netmobiel stuurt via SMS een activatiecode naar
          {{ selectedAccount.firstName }}. Deze code kun je later invoeren.
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn
            rounded
            outlined
            color="primary"
            @click="delegationRequestDialog = false"
          >
            Annuleren
          </v-btn>
          <v-btn rounded depressed color="button" @click="requestDelegation()">
            Aanvragen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import { throttle } from 'lodash'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'
import { emptyPage } from '@/store/storeHelper'
import constants from '@/constants/constants'
import GenericList from '@/components/lists/GenericList'
import AccountItem from '@/components/profile/AccountItem'
const PASSENGER = constants.PROFILE_ROLE_PASSENGER.toUpperCase()
export default {
  name: 'AddDelegationPage',
  components: { ContentPane, GenericList, AccountItem },
  data() {
    return {
      search: '',
      showResults: false,
      selectedAccount: null,
      delegationRequestDialog: false,
      isAccountCreationEnabled: false,
    }
  },
  computed: {
    myProfile() {
      return psStore.getters.getProfile
    },
    searchResults() {
      // Add a delegation for your own account so that you are shown
      // in the user list in the delegation overview page.
      // let profile = context.state.user.delegateProfile
      // if (!profile) {
      //   profile = context.state.user.profile
      // }
      // const own_delegation = { id: -1, delegate: profile, delegator: profile }
      // response.data.data.splice(0, 0, own_delegation)
      const delegations = psStore.getters.getDelegations.data
      psStore.getters.getSearchResults.data.forEach((p) => {
        p.managed = delegations.find((d) => d.delegator.id === p.id) != null
      })
      return psStore.getters.getSearchResults.data.filter(
        (p) => p.id !== this.myProfile.id
      )
    },
  },
  watch: {
    search: throttle(function (val) {
      if (val != null && val.length >= 3) {
        this.showResults = true
        psStore.actions.fetchProfiles({ keyword: val, role: PASSENGER })
      } else {
        this.showResults = false
        psStore.mutations.setSearchResults(emptyPage)
      }
    }, 500),
  },
  mounted() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    clearSearchInput() {
      this.search = ''
    },
    onSelectAccount(account) {
      this.selectedAccount = account
      this.delegationRequestDialog = true
    },
    requestDelegation() {
      const payload = {
        delegateId: this.myProfile.id,
        delegatorId: this.selectedAccount.id,
      }
      psStore.actions.requestDelegation(payload).then((delegationRef) => {
        if (delegationRef) {
          this.$router.push({ name: 'delegationOverview' })
        }
      })
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
