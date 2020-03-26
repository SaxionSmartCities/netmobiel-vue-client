<template>
  <content-pane>
    <v-row align="center">
      <v-col>
        Credits
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        Saldo
      </v-col>
      <v-col> {{ creditAmount }} credits </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        <v-btn>Doel steunen</v-btn>
      </v-col>
      <v-col>
        <v-btn>Sparen voor mijn reward</v-btn>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        <v-btn
          large
          rounded
          block
          depressed
          color="button"
          disabled
          @click="router.push('/addCredits')"
          >Credits toevoegen</v-btn
        >
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col>
        Overzicht
      </v-col>
    </v-row>
    <v-divider />
    <v-row v-for="(transaction, index) in creditHistory" :key="index">
      <v-col>
        <v-row align="center">
          <v-col>Maandag 17 juni 2019</v-col>
        </v-row>
        <v-row align="center">
          <v-col>07:45</v-col>
          <v-col>Rit met Coby Hoekstra Naar Lutjebroek</v-col>
          <v-col>+ 5</v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
export default {
  name: 'Credits',
  components: {
    ContentPane,
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
  created: function() {
    this.$store.commit('ui/showBackButton')
    this.$store.dispatch('ps/fetchCreditAmount')
    this.$store.dispatch('ps/fetchCreditHistory')
  },
}
</script>
<style lang="scss"></style>
