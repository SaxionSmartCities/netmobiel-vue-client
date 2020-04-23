<template>
  <v-row no-gutters>
    <v-col class="text-center">
      <v-progress-circular
        :rotate="-90"
        :size="100"
        :width="11"
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
