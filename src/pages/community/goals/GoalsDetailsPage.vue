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
          :number-of-donors="33"
          :credits-remaining="43"
          :value-total="232"
        >
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar
          name="credits"
          :value="65"
          :content-multi-line="true"
          postfix="credits"
          :number-of-donors="33"
          :value-current="76"
          :credits-remaining="43"
          :value-total="232"
        >
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar
          name="Behaald"
          :content-percentage="true"
          :number-of-donors="33"
          :credits-remaining="43"
          :value-current="76"
          :value-total="232"
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
        <span class="font-weight-medium primary--text">Top donateurs</span>
      </v-row>
      <v-row>
        <v-divider />
      </v-row>
      <v-row>
        <donors-list :donors="selectedGoal.donors"> </donors-list>
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
  computed: {
    selectedGoal() {
      return this.$store.getters['sg/getGoals'].find(goal => goal.id == this.id)
    },
  },
  methods: {
    fetchGoals() {
      return this.$store.getters['sg/getGoals']
    },
  },
}
</script>

<style scoped></style>
