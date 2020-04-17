<template>
  <content-pane>
    <v-row align="center" justify="center">
      <v-img
        src="@/assets/achterhoek_background.jpg"
        lazy-src="https://picsum.photos/id/11/100/60"
        aspect-ratio="1"
        class="grey lighten-2"
        max-width="500"
        max-height="300"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-row>
    <v-row>
      <h1 class="netmobiel">
        {{ selectedGoal.title }}
      </h1>
    </v-row>
    <v-row class="mb-4">
      <span class="overline">{{ selectedGoal.location }}</span>
    </v-row>
    <v-row>
      <span>
        {{ selectedGoal.description }}
      </span>
    </v-row>
    <v-row>
      <v-col>
        <goal-progress-bar
          name="Donateurs"
          :number-of-donors="selectedGoal.donors.length"
          :credits-remaining="getCreditsRemaining()"
          :value-total="selectedGoal.creditsTotal"
        >
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar
          name="credits"
          :value="65"
          :content-multi-line="true"
          postfix="credits"
          :number-of-donors="selectedGoal.donors.length"
          :value-current="selectedGoal.creditsDonated"
          :credits-remaining="getCreditsRemaining()"
          :value-total="selectedGoal.creditsTotal"
        >
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar
          name="Behaald"
          :content-percentage="true"
          :number-of-donors="selectedGoal.donors.length"
          :credits-remaining="getCreditsRemaining()"
          :value-current="selectedGoal.creditsDonated"
          :value-total="selectedGoal.creditsGoal"
        >
        </goal-progress-bar>
      </v-col>
    </v-row>
    <v-row>
      <v-btn large rounded block mb-4 depressed color="button">
        Steun dit doel
      </v-btn>
    </v-row>
    <v-container>
      <v-row mb-3 mt-3>
        <h4 class="netmobiel">
          Top donateurs
        </h4>
      </v-row>
      <v-row>
        <v-divider />
      </v-row>
      <v-row>
        <donors-list :donors="getTopDonors()"> </donors-list>
      </v-row>
    </v-container>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import DonorsList from '@/components/community/goals/DonorsList'
import GoalProgressBar from '@/components/community/goals/GoalProgressBar'
export default {
  name: 'GoalsDetailsPage',
  components: { GoalProgressBar, DonorsList, ContentPane },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  created: function() {
    this.$store.commit('ui/showBackButton')
  },
  computed: {
    selectedGoal() {
      return this.$store.getters['sg/getGoals'].find(goal => goal.id == this.id)
    },
  },
  methods: {
    getGoals() {
      return this.$store.getters['sg/getGoals']
    },
    getTopDonors() {
      return this.$store.getters['sg/getTopDonorsList']
    },
    getCreditsRemaining() {
      this.selectedGoal.creditsGoal - this.selectedGoal.creditsDonated
    },
  },
}
</script>

<style scoped></style>
