<template>
  <content-pane>
    <template #header>
      <tab-bar
        :num-tabs="numTabs"
        :selected-tab-model="selectedTab"
        @tabChange="selectedTab = $event"
      >
        <template #firstTab>
          <span>Doelen</span>
        </template>
        <template #secondTab>
          <span>Uitbetalingen</span>
        </template>
        <template #thirdTab>
          <span>Incentives</span>
        </template>
      </tab-bar>
    </template>
    <v-row v-if="selectedTab === 0" class="d-flex flex-column">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="charities"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
    <v-row v-else-if="selectedTab === 1" class="d-flex flex-column">
      <v-col>
        <h2>Lopende uitbetalingsverzoeken</h2>
      </v-col>
      <v-col>
        <v-data-table
          :headers="headersWithdrawal"
          :items="withdrawals"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
      <v-col>
        <v-btn rounded color="button" depressed block @click="registreerDoel()">
          Maak een batch van de lopende uitbetalingsverzoeken
        </v-btn>
      </v-col>
      <v-col>
        <h2>Batches</h2>
      </v-col>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="charities"
          :items-per-page="5"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
    <v-row v-else-if="selectedTab === 2" class="d-flex flex-column">
      <v-col>
        <p>Incentives</p>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import TabBar from '@/components/common/TabBar'
import * as chsStore from '@/store/charity-service'

export default {
  name: 'ManagementOverviewPage',
  components: { ContentPane, TabBar },
  data() {
    return {
      numTabs: 3,
      selectedTab: 0,
      headers: [
        {
          text: 'Naam',
          value: 'name',
        },
        {
          text: 'Doel bedrag',
          value: 'goalAmount',
        },
        {
          text: 'Opgehaald bedrag',
          value: 'donatedAmount',
        },
      ],
      headersWithdrawal: [
        {
          text: 'Naam',
          value: 'ibanHolder',
        },
        {
          text: 'Omschrijving',
          value: 'description',
        },
        {
          text: 'Bedrag',
          value: 'amountEurocents',
        },
      ],
    }
  },
  computed: {
    charities() {
      return chsStore.getters.getCharities
    },
    withdrawals() {
      return chsStore.getters.getWithdrawals
    },
  },
  mounted() {
    chsStore.actions.fetchCharities()
    chsStore.actions.fetchWithdrawals()
    chsStore.actions.fetchPaymentBatches()
  },
}
</script>

<style scoped></style>
