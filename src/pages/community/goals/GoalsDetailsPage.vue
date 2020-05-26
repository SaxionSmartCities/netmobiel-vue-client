<template>
  <content-pane>
    <v-row align="center" justify="center">
      <v-col>
        <v-img
          src="@/assets/achterhoek_background.jpg"
          lazy-src="https://picsum.photos/id/11/100/60"
          aspect-ratio="1"
          class="goal-jumbo-image"
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
      </v-col>
    </v-row>
    <v-row>
      <v-col pt-0>
        <h1 class="netmobiel">
          {{ selectedGoal.title }}
        </h1>
        <span class="overline">{{ selectedGoal.location }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>{{ selectedGoal.description }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <goal-progress-bar
          name="Donateurs"
          :value-current="selectedGoal.donors.length"
        >
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar
          name="Credits"
          :value-current="selectedGoal.creditsDonated"
        >
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar
          name="Behaald"
          :display-percentage="true"
          :value-current="selectedGoal.creditsDonated"
          :value-total="selectedGoal.creditsGoal"
        >
        </goal-progress-bar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn large rounded block mb-4 depressed color="button">
          Steun dit doel
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="netmobiel my-3">
          Top donateurs
        </h4>
        <v-divider />
        <donors-list :donors="donors"></donors-list>
      </v-col>
    </v-row>
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
    id: { type: String, required: true },
  },
  computed: {
    selectedGoal() {
      return this.$store.getters['gos/getGoals'].find(
        goal => goal.id == this.id
      )
    },
    donors() {
      return this.selectedGoal.donors
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
}
</script>

<style scoped>
.goal-jumbo-image {
  border-radius: 10px;
}
</style>
