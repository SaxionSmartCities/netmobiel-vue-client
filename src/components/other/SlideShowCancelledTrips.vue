<template>
  <v-row class="slide-show-row">
    <v-col>
      <slot name="card"></slot>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SlideShowCancelledTrips',
  props: {
    trips: { type: Array, required: true },
  },
}
</script>

<style lang="scss" scoped>
.slide-show-row {
  background-color: $color-alertRed;
}
</style>
