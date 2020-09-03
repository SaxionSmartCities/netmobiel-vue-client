<template>
  <v-row class="slide-show-row">
    <v-col class="px-5 py-1">
      <div
        class="d-flex flex-row justify-space-between alert-red"
        @click="showCards = !showCards"
      >
        <span>Er zijn {{ trips.length }} geannuleerde reizen.</span>
        <v-icon v-if="showCards" class="alert-red">
          keyboard_arrow_down
        </v-icon>
        <v-icon v-else class="alert-red">
          keyboard_arrow_left
        </v-icon>
      </div>
      <div v-if="showCards" class="carousel-container">
        <v-carousel
          height="100%"
          hide-delimiter-background
          :continuous="false"
          light
        >
          <v-carousel-item v-for="(trip, index) in trips" :key="index">
            <div class="cards-container">
              <slot name="card" :trip="trip" :index="index"></slot>
            </div>
          </v-carousel-item>
        </v-carousel>
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

<style lang="scss">
.slide-show-row {
  background-color: lighten($color-alertRed, 50%);
  .alert-red {
    color: $color-alertRed;
  }
  z-index: 0;
}
.carousel-container {
  .v-carousel {
    padding-bottom: 20px;
    .v-window__container {
      .v-window__prev,
      .v-window__next {
        margin: 0 !important;
      }
    }
  }
  .cards-container {
    padding: 8px 0;
    .trip-card {
      border-color: $color-alertRed !important;
      width: 85%;
      margin: auto;
      .v-card__actions {
        display: none;
      }
    }
  }
  .v-carousel__controls {
    z-index: 4;
    position: absolute;
    padding-top: 20px !important;
    .v-btn--icon.v-size--small {
      height: 24px;
      width: 24px;
      svg {
        width: 50%;
        height: 50%;
      }
    }
  }
}
</style>
