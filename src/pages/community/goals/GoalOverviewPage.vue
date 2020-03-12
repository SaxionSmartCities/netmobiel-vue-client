<template xmlns:display="http://www.w3.org/1999/xhtml">
  <content-pane>
    <v-row mb-3>
      <h1>Doelen</h1>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row mt-6>
      <v-text-field
        outlined
        label="zoeken"
        prepend-inner-icon="search"
      ></v-text-field>
    </v-row>
    <v-row mb-3 mt-3>
      <span class="font-weight-medium primary--text"
        >Populair in de buurt
      </span>
    </v-row>
    <v-row>
      <goal-card
        :id="4"
        titel="Renovatie St. Bonifatiuskerk"
        plaatsnaam="Lichtenvoorde"
        :credits-remaining="233"
      ></goal-card>
    </v-row>
    <v-row mb-3 mt-3>
      <span class="font-weight-medium primary--text">Eerder gedoneerd </span>
    </v-row>
    <v-row>
      <v-slide-group center-active mobile-break-point="300">
        <v-slide-item
          v-for="(item, index) in fetchListSize()"
          :key="index"
          v-slot:default="{ active, toggle }"
        >
          <goal-card
            :id="fetchGoalForIndex(index).id"
            :titel="fetchGoalForIndex(index).title"
            :plaatsnaam="fetchGoalForIndex(index).location"
            :credits-remaining="20"
            :credits-total="100"
          ></goal-card>
        </v-slide-item>
      </v-slide-group>
    </v-row>
    <v-row mb-3 mt-3>
      <span class="font-weight-medium primary--text">Top donateurs</span>
    </v-row>
    <v-row>
      <donors-list :donors="gdonors"> </donors-list>
    </v-row>
  </content-pane>
</template>

<script>
import GoalCard from '../../../components/community/GoalCard'
import ContentPane from '../../../components/common/ContentPane'
import { mapGetters } from 'vuex'
import DonorsList from '../../../components/community/DonorsList'
export default {
  name: 'GoalOverviewPage',
  components: { DonorsList, ContentPane, GoalCard },
  data: function() {
    return {}
  },
  computed: {
    ...mapGetters({
      getSavedGoals: 'sg/fetchGoals',
    }),
    gdonors() {
      return this.$store.getters['sg/getTopDonorsList']
    },
  },
  methods: {
    fetchGoals() {
      return this.$store.getters['sg/fetchGoals']
    },
    fetchGoalForIndex(index) {
      return this.getSavedGoals[index]
    },
    fetchListSize() {
      return this.$store.getters['sg/getGoalListSize']
    },
    fetchTopDonors() {
      return this.$store.getters['sg/getTopDonorsList']
    },
  },
}
</script>

<style lang="scss"></style>
