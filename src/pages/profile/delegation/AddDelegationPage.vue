<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Account toevoegen</h3>
        <span>
          Zoek naar een bestaand account om te beheren of maak een nieuwe aan.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="text-primary">Zoek bestaande account</h4>
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
          label="Telefoon / Email"
          @click:clear="clearSearchInput"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="showResults">
      <v-col>
        <h4>Resultaten</h4>
        <account-list
          :accounts="searchResults"
          empty-list-label="Geen accounts gevonden"
          @AccountSelected="onSelectAccount"
        />
      </v-col>
    </v-row>
    <v-row v-else>
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
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import AccountList from '@/components/lists/AccountList'
import { throttle } from 'lodash'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'

export default {
  name: 'AddDelegationPage',
  components: { ContentPane, AccountList },
  data() {
    return {
      search: '',
      showResults: false,
    }
  },
  computed: {
    searchResults() {
      const delegations = psStore.getters.getDelegations
      return psStore.getters.getSearchResults.map(r => {
        return {
          ...r,
          managed: !!delegations.find(d => d.delegator.id === r.id),
        }
      })
    },
  },
  watch: {
    search: throttle(function(val) {
      if (val != null && val.length > 3) {
        this.showResults = true
        psStore.actions.fetchProfiles({ keyword: val })
      } else {
        this.showResults = false
        psStore.mutations.setSearchResults([])
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
      const profileId = psStore.getters.getProfile.id
      const payload = {
        delegateId: profileId,
        delegatorId: account.id,
      }
      psStore.actions.storeDelegation(payload)
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
