<template>
  <v-col>
    <v-row>
      <v-progress-circular
        :rotate="-90"
        :size="100"
        :width="11"
        :value="computedProgress"
        color="primary"
      >
        <div v-if="contentMultiLine === true">
          {{ valueCurrent }}
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
    </v-row>
    <v-row>
      <span>{{ name }}</span>
    </v-row>
  </v-col>
</template>

<style>
@media (max-width: 500px) {
  .v-progress-circular {
    max-width: 75px;
    font-size: 80%;
  }
}
</style>

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
    valueCurrent: {
      type: Number,
      default: 0,
    },
    valueRemainder: {
      type: Number,
      default: 0,
    },
    valueTotal: {
      type: Number,
      default: 0,
    },
    postfix: {
      type: String,
      default: '',
    },
  },
  computed: {
    computedProgress() {
      return Math.round((this.valueCurrent / this.valueTotal) * 100)
    },
  },
}
</script>

<style scoped></style>
