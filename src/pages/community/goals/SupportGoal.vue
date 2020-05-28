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
        </v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col pt-0>
        <h2 class="netmobiel">
          {{ selectedGoal.title }}
        </h2>
        <span class=" overline">{{ selectedGoal.location }}</span>
      </v-col>
    </v-row>
    <v-row class="flex-column">
      <v-col>
        <span class="text-color-primary subtitle-1 text-uppercase">
          Hoeveel wil je doneren?
        </span>
        <v-text-field
          v-model="donationAmount"
          class="input-support-goal"
          outlined
          dense
          hide-details
          placeholder="0"
          type="number"
        >
        </v-text-field>
      </v-col>
      <v-col>
        <span class="text-color-primary subtitle-1 text-uppercase">
          Persoonlijk bericht? (optioneel)
        </span>
        <v-textarea
          v-model="donationMessage"
          outlined
          hide-details
        ></v-textarea>
        <v-switch
          v-model="isAnonymouse"
          color="primary"
          hide-details
          :label="'Maak mijn donatie anoniem.'"
        >
        </v-switch>
      </v-col>
      <v-col>
        <v-btn rounded color="button" depressed block @click="donate()">
          Nu doneren
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../../components/common/ContentPane'
export default {
  name: 'SupportGoal',
  components: { ContentPane },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      donationAmount: 0,
      donationMessage: '',
      isAnonymouse: false,
    }
  },
  computed: {
    selectedGoal() {
      return this.$store.getters['gos/getGoals'].find(
        goal => goal.id === Number(this.id)
      )
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    donate() {
      this.$router.push({
        name: 'donated',
        params: { name: this.selectedGoal.title },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.input-support-goal {
  max-width: 100px;
}
</style>
