<template>
  <v-row no-gutters class="flex-column">
    <v-col class="text-center font-weight-bold">
      <v-progress-circular
        :rotate="-90"
        :size="75"
        :width="8"
        :value="computedProgress"
        color="primary"
      >
        <div v-if="displayPercentage === true">
          {{ computedProgress + '%' }}
        </div>
        <div v-else>
          {{ valueCurrent }}
        </div>
      </v-progress-circular>
    </v-col>
    <v-col class="text-center my-2">
      <span>{{ name }}</span>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'GoalProgressBar',
  props: {
    name: { type: String, required: true },
    valueCurrent: { type: Number, default: 0 },
    valueTotal: { type: Number, default: 0 },
    displayPercentage: { type: Boolean, default: false },
  },
  computed: {
    computedProgress() {
      return Math.round((this.valueCurrent / this.valueTotal) * 100)
    },
  },
}
</script>

<style scoped></style>
