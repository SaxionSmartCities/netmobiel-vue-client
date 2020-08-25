<template>
  <v-row class="slide-show-row">
    <v-col class="text-center">
      <span class="body-1">Klik hier om de geannuleerde trips te zien</span>
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
  background-color: lighten($color-alertRed, 50%);
}
</style>
