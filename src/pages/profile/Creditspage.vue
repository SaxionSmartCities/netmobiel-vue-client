<template>
  <content-pane>
    <v-row align="center">
      <v-col class="px-0">
        <h3>Credits</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row align="center">
      <v-col class="px-0 mr-2 shrink">
        <strong>Saldo</strong>
      </v-col>
      <v-col class="body-2"> {{ creditAmount }} credits </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row align="center">
      <v-col>
        <v-btn
          large
          rounded
          outlined
          color="primary"
          disabled
          @click="router.push('/addCredits')"
        >
          Doel steunen
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          large
          rounded
          block
          outlined
          disabled
          color="primary"
          @click="router.push('/addCredits')"
        >
          Rewards
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        <v-btn
          large
          rounded
          block
          depressed
          disabled
          color="button"
          @click="router.push('/addCredits')"
        >
          Credits toevoegen
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col class="px-0">
        <h3 class="text-primary-uppercase">Reizen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row v-for="(transaction, index) in creditHistory" :key="index">
      <credit-history-line :transaction="transaction"></credit-history-line>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CreditHistoryLine from '@/components/profile/creditHistoryLine.vue'
export default {
  name: 'Credits',
  components: {
    ContentPane,
    CreditHistoryLine,
  },
  data() {
    return {
      stuff: false,
    }
  },
  computed: {
    creditAmount() {
      return this.$store.getters['ps/getCreditAmount']
    },
    creditHistory() {
      return this.$store.getters['ps/getCreditHistory']
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
    this.$store.dispatch('ps/fetchCreditAmount')
    this.$store.dispatch('ps/fetchCreditHistory')
  },
}
</script>
<style lang="scss"></style>
