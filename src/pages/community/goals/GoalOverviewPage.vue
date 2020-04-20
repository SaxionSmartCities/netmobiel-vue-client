<template>
  <content-pane :clearpadding="true">
    <v-row mb-3>
      <v-col>
        <h1 class="netmobiel">
          Doelen
        </h1>
      </v-col>
    </v-row>
    <v-row mt-6>
      <v-text-field
        outlined
        label="zoeken"
        prepend-inner-icon="search"
      ></v-text-field>
    </v-row>
    <v-row mb-3 mt-3>
      <v-col>
        <h4 class="netmobiel">
          Populair in de buurt
        </h4>
      </v-col>
    </v-row>
    <v-row>
      <goal-card
        :id="getSavedGoals[0].id"
        :titel="getSavedGoals[0].title"
        :plaatsnaam="getSavedGoals[0].location"
        :credits-donated="getSavedGoals[0].creditsDonated"
        :credits-total="getSavedGoals[0].creditsGoal"
      ></goal-card>
    </v-row>
    <v-row mb-3 mt-3>
      <v-col>
        <h4 class="netmobiel">
          Eerder gedoneerd
        </h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-slide-group center-active mobile-break-point="100">
          <v-slide-item
            v-for="item in getSavedGoals"
            :key="item.id"
            v-slot:default="{ active, toggle }"
          >
            <goal-card
              :id="item.id"
              :titel="item.title"
              :plaatsnaam="item.location"
              :credits-donated="item.creditsDonated"
              :credits-total="item.creditsGoal"
            ></goal-card>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row>
    <v-row mb-3 mt-3>
      <v-col>
        <h4 class="netmobiel">Top donateurs</h4>
      </v-col>
    </v-row>
    <v-row>
      <donors-list :donors="getTopDonors"> </donors-list>
    </v-row>
  </content-pane>
</template>

<style>
/**
makes sure that cards are aligned on small devices, but still show arrows(prev&next) on desktop.
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

<script>
import GoalCard from '@/components/community/goals/GoalCard'
import ContentPane from '@/components/common/ContentPane'
import DonorsList from '@/components/community/goals/DonorsList'
import { mapGetters } from 'vuex'

export default {
  name: 'GoalOverviewPage',
  components: { DonorsList, ContentPane, GoalCard },
  computed: {
    ...mapGetters({
      getSavedGoals: 'sg/getGoals',
      getTopDonors: 'sg/getTopDonorsList',
    }),
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
}
</script>

<style lang="scss"></style>
