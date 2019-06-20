<template>
  <v-layout column travel-card ma-2>
    <v-flex>
      <v-layout row align-center>
        <v-flex xs4 ma-4>
          <v-img class="rounded-image" aspect-ratio="1" :src="itemObj.image"></v-img>
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
              <v-btn flat round>
                <v-icon class="arrow-right">chevron_right</v-icon>
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
          ></v-progress-linear>
        </v-flex>
      </v-layout>
      <v-layout v-if="!donatedCredits" align-center ma-4>
        <v-flex pr-1>
          <div class="grey-text">
            Nog
            {{ itemObj.goalCredits - itemObj.currentCredits }}
            credits
          </div>
        </v-flex>
        <v-flex pl-1>
          <v-btn round>Doel steunen</v-btn>
        </v-flex>
      </v-layout>
      <v-layout v-else align-center column>
        <v-flex ma-2 class="grey-text"
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
  background-color: $color-optionsGray;
  border-radius: 10px;
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
</style>
