<template>
  <v-layout column travel-card ma-2>
    <v-flex>
      <v-layout row align-center>
        <v-flex xs4 ma-4>
          <v-img aspect-ratio="1" :src="itemObj.image"></v-img>
        </v-flex>
        <v-flex>
          <v-layout column align-end>
            <v-flex pr-4>
              <h3>{{ itemObj.name }}</h3>
              <p>{{ itemObj.address }}</p>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="donated">
          <v-layout row align-end justify-end fill-height>
            <v-flex>
              <v-btn flat round @click="$router.push('')">
                <v-icon color="grey">chevron_right</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout>
        <v-flex mx-4>
          <v-progress-linear
            :value="calculateProgress()"
            class="progressbar"
            color="#2e8997"
            background-color="grey"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
      <v-layout v-if="!donatedCredits" align-center>
        <v-flex>
          <v-subheader
            >Nog
            {{ itemObj.goalCredits - itemObj.currentCredits }}
            credits
          </v-subheader>
        </v-flex>
        <v-flex ma-2>
          <v-btn round>Doel steunen</v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-else align-center column>
        <v-flex ma-2 class="grey--text"
          >Gedoneerd door jou :{{ donated }} Credits
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'GoalIteam',
  props: ['item', 'donatedCredits'],
  data: function() {
    return {
      itemObj: this.item,
      donated: this.donatedCredits,
    }
  },
  methods: {
    calculateProgress: function() {
      return (this.itemObj.currentCredits / this.itemObj.goalCredits) * 100
    },
  },
}
</script>

<style lang="scss">
.progressbar {
  color: $color-green;
  background-color: $color-optionsGray;
}

p {
  margin-bottom: 0px;
}
</style>
