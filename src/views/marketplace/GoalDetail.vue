<template>
  <v-container>
    <v-layout column>
      <v-flex xs12>
        <p class="headline mb-0">
          {{ goal.subject }}
        </p>
      </v-flex>
      <v-flex xs12>
        <p class="grey--text">
          {{ goal.locatie }}
        </p>
      </v-flex>
      <v-flex xs12>
        <p class="subheading font-weight-medium pt-1">
          {{ goal.description }}
        </p>
      </v-flex>
    </v-layout>
    <v-layout justify-space-around pb-3 row>
      <v-flex class="text-xs-center" shrink>
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="12"
          :value="100"
          color="teal"
        >
          <p class="title mb-0">{{ goal.donators }}</p>
        </v-progress-circular>
        <p class="subheading font-weight-light my-1 ">Donateurs</p>
      </v-flex>
      <v-flex class="text-xs-center" shrink>
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="12"
          :value="getPercentageReceived"
          color="teal"
        >
          <p class="title mb-0">{{ goal.receivedCredits }}</p>
          <p class="grey--text mb-0">
            credits
          </p>
        </v-progress-circular>
        <p class="body-2 font-weight-light my-1">Gedoneerd</p>
      </v-flex>
      <v-flex class="text-xs-center" shrink>
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="12"
          :value="getPercentageReceived"
          color="teal"
        >
          <p class="title mb-0">{{ getPercentageReceived }}%</p>
        </v-progress-circular>
        <p class="subheading font-weight-light my-1">Behaald</p>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-btn round large block class="subheading"> Steun dit doel </v-btn>
      </v-flex>
    </v-layout>
    <v-layout pt-3>
      <v-flex class="text-end">
        <p class="text-uppercase font-weight-light mb-0">donators</p>
      </v-flex>
      <v-flex shrink>
        <v-btn round>beste</v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="my-2"></v-divider>
    <v-layout v-for="donator in goal.topDonators">
      <v-flex  xs12>
        <v-layout>
          <v-flex shrink>
            <round-image :size-img="50"></round-image>
          </v-flex>
          <v-flex ml-2>
            <p class="subheading font-weight-light mb-1">
              {{ donator.name }}
            </p>
            <p class="caption grey--text font-weight-light mb-0">
              {{ donator.donatedCredits }} credits gedoneerd
            </p>
            <p class=" body-1 font-weight-light mt-1">
              {{ donator.comment }}
            </p>
          </v-flex>
        </v-layout>
        <v-divider class="my-2"></v-divider>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RoundImage from '../common/RoundImage'
export default {
  name: 'GoalDetail',
  components: { RoundImage },
  data() {
    return {
      value: 80,
      goal: {
        subject: 'Renovatie De Zwaan',
        locatie: 'Museumcafé, Bredevoort',
        description:
          'Museumcafé De Zwaan in Bredevoort heeft een lange historie. Het café is geliefd bij het publiek en neemt een centrale rol in tijdens de jaarlijkse Boekenmarkt. ',
        donators: 32,
        creditsGoal: 1200,
        receivedCredits: 900,
        topDonators: [
          {
            name: 'Henk van der laan',
            donatedCredits: 50,
            comment: 'Ontzettend leuk! Veel succes allen.',
          },
          {
            name: 'Marc de Vries',
            donatedCredits: 20,
            comment: '',
          },
          {
            name: 'Netmobiel gebruiker',
            donatedCredits: 10,
            comment: '',
          },
          {
            name: 'Wout',
            donatedCredits: 4,
            comment: '',
          },
        ],
      },
    }
  },
  computed: {
    getPercentageReceived() {
      return (this.goal.receivedCredits / this.goal.creditsGoal) * 100
    },
  },
}
</script>

<style scoped>
.background-fix {
  background-color: #2e8997;
}
.text-end {
  vertical-align: text-bottom;
}
</style>
