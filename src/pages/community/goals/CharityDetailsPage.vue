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
        <h1 class="netmobiel"></h1>
        <span class="overline">{{}}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>{{}}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!--        <goal-progress-bar name="Donateurs" :value-current="">-->
        <!--        </goal-progress-bar>-->
      </v-col>
      <v-col>
        <!--        <goal-progress-bar name="Credits" :value-current="">-->
        <!--        </goal-progress-bar>-->
      </v-col>
      <v-col>
        <!--        <goal-progress-bar-->
        <!--          name="Behaald"-->
        <!--          :display-percentage="true"-->
        <!--          :value-current=""-->
        <!--          :value-total=""-->
        <!--        >-->
        <!--        </goal-progress-bar>-->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          block
          mb-4
          depressed
          color="button"
          @click="$router.push({ name: 'supportGoal' })"
        >
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
        <!--        <donors-list :donors=""></donors-list>-->
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
// import DonorsList from '@/components/community/goals/DonorsList'
// import GoalProgressBar from '@/components/community/goals/GoalProgressBar'
import * as uiStore from '@/store/ui'
import * as chsStore from '@/store/charity-service'

export default {
  name: 'CharityDetailPage',
  components: { ContentPane },
  props: {
    id: { type: String, required: true },
  },
  computed: {
    selectedCharity() {
      return chsStore.getters.getSelectedCharity
    },
    donors() {
      return this.selectedGoal.donors
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    chsStore.actions.lookupCharity(this.id)
  },
}
</script>

<style scoped>
.goal-jumbo-image {
  border-radius: 10px;
}
</style>
