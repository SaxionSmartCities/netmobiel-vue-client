<template>
  <v-row class="slide-show-row">
    <v-col class="px-5 py-1">
      <div
        class="d-flex flex-row justify-space-between alert-red"
        @click="showCards = !showCards"
      >
        <span>Er zijn ook {{ trips.length }} geannuleerde reizen.</span>
        <v-icon class="alert-red">keyboard_arrow_down</v-icon>
      </div>
      <div v-if="showCards" class="mt-2 cards-container">
        <slot
          v-for="(trip, index) in trips"
          name="card"
          :trip="trip"
          :index="index"
        ></slot>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SlideShowCancelledTrips',
  props: {
    trips: { type: Array, required: true },
  },
  data() {
    return {
      showCards: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.slide-show-row {
  background-color: lighten($color-alertRed, 50%);
  .cards-container {
    overflow-x: scroll;
    white-space: nowrap;
    &,
    .trip-card {
      display: inline-block;
      width: 100%;
      margin-right: 8px;
    }
  }
  .alert-red {
    color: $color-alertRed;
  }
}
</style>
