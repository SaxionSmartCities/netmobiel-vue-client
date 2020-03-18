<template>
  <v-col cols="4">
    <v-row>
      <v-col cols="12">
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="11"
          :value="computedProgress"
          color="primary"
        >
          <div v-if="contentMultiLine === true">
            {{ creditsDonated }}
            <br />
            {{ postfix }}
          </div>
          <div v-else-if="contentPercentage === true">
            {{ computedProgress + '%' }}
          </div>
          <div v-else>
            {{ numberOfDonors }}
          </div>
        </v-progress-circular>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>{{ name }}</span>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'GoalProgressBar',
  props: {
    //used to display multiple lines inside progress_bar_info
    contentMultiLine: { type: Boolean, default: false },
    //used to display percentage postfix
    contentPercentage: { type: Boolean, default: false },
    name: { type: String, required: true },
    numberOfDonors: { type: Number, default: 0 },
    //TODO how is this going to be used in the store?
    creditsDonated: {
      type: Number,
      default: 0,
    },
    creditsRemaining: {
      type: Number,
      default: 0,
    },
    creditsTotal: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      postfix: 'credits',
    }
  },
  computed: {
    computedProgress: function() {
      if (this.name === 'Donateurs') {
        //todo: progress bar with 'Number of donors' is always full.
        //maybe this could be handled differently.
        return 100
      } else {
        return Math.round((this.creditsDonated / this.creditsTotal) * 100)
      }
    },
  },
}
</script>

<style scoped></style>
