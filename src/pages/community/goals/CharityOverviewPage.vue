<template>
  <content-pane :clearpadding="true">
    <v-row mb-3>
      <v-col ml-3>
        <h1 class="netmobiel">
          Doelen
        </h1>
        <v-divider class="mt-2"></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="">
        <v-text-field
          dense
          outlined
          label="Zoeken"
          hide-details
          prepend-inner-icon="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="title text-color-primary mb-2">
          Populair in de buurt
        </h4>
        <div class="charity-list">
          <template v-for="charity in charities">
            <charity-card
              :key="charity.id"
              class="charity-card mr-3"
              :charity="charity"
              @lookupCharity="onCharityCardClick"
            ></charity-card>
          </template>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="title text-color-primary mb-2">
          Eerder gedoneerd
        </h4>
        <div class="charity-list">
          <template v-for="charity in previouslyDonatedCharities">
            <charity-card
              :key="charity.id"
              class="charity-card mr-3"
              :charity="charity"
              @lookupCharity="onCharityCardClick"
            ></charity-card>
          </template>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="netmobiel my-3">Top donateurs</h4>
        <v-divider />
        <top-donor-list :donors="topDonors"></top-donor-list>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as chsStore from '@/store/charity-service'
import * as uiStore from '@/store/ui'
import CharityCard from '@/components/community/charity/CharityCard'
import TopDonorList from '@/components/community/charity/TopDonorList'

export default {
  name: 'CharityOverviewPage',
  components: { TopDonorList, CharityCard, ContentPane },
  computed: {
    charities() {
      return chsStore.getters.getCharities
    },
    previouslyDonatedCharities() {
      return chsStore.getters.getPreviouslyDonatedCharities
    },
    topDonors() {
      return chsStore.getters.getTopDonors
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    chsStore.actions.fetchCharities()
    chsStore.actions.fetchPreviouslyDonatedCharities()
    chsStore.actions.fetchTopDonors()
  },
  methods: {
    onCharityCardClick(val) {
      this.$router.push({ name: 'charityDetails', params: { id: val } })
    },
  },
}
</script>

<style lang="scss">
.charity-list {
  overflow: auto;
  white-space: nowrap;

  .charity-card {
    display: inline-block;
  }
}
/**
makes sure that cards are aligned on small devices, but still show arrows(prev&next) on desktop
 */
@media (max-width: 767.98px) {
  .v-slide-group__prev {
    display: none !important;
  }
  .v-slide-group__next {
    display: none !important;
  }
}
</style>
