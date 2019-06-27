<template>
  <v-layout column travel-card mr-2>
    <v-flex>
      <v-layout row align-center>
        <v-flex xs4 ma-3>
          <v-img
            class="rounded-image"
            aspect-ratio="1"
            :src="itemObj.image"
            width="80"
            height="80"
          ></v-img>
        </v-flex>
        <v-flex>
          <v-layout column>
            <v-flex pr-4 my-2>
              <h3>{{ itemObj.name }}</h3>
            </v-flex>
            <v-flex>
              <p>{{ itemObj.address }}</p>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="donated">
          <v-layout row align-end justify-end fill-height>
            <v-flex>
              <v-btn flat round>
                <v-icon class="arrow-right">chevron_right</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout column
        ><v-flex >
          <v-flex mx-3>
            <v-progress-linear
              :value="calculateProgress()"
              class="progressbar"
            ></v-progress-linear> </v-flex></v-flex
        ><v-flex>
          <v-layout v-if="!donatedCredits" align-center row fill-height ma-3>
            <v-flex>
              <div class="grey-text">
                Nog
                {{ itemObj.goalCredits - itemObj.currentCredits }}
                credits
              </div>
            </v-flex>
            <v-flex xs5>
              <v-btn round>Doel steunen</v-btn>
            </v-flex>
          </v-layout>
          <v-layout v-else column>
            <v-flex ma-3 class="grey-text"
              >Door jou gedoneerd: {{ donated }} Credits
            </v-flex>
          </v-layout></v-flex
        ></v-layout
      >
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
  background-color: $color-optionsGray;
  border-radius: 10px;
  margin: 0;
  .v-progress-linear__bar__determinate {
    background-color: $color-green;
  }
}
.arrow-right {
  color: $color-optionsGray !important;
}
.grey-text {
  color: $color-optionsGray;
}
.rounded-image {
  border-radius: 10px;
}
.travel-card {
  border-color: #CCC;
}
</style>
