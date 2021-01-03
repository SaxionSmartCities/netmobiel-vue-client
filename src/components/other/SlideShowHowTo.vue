<template>
  <v-row>
    <v-col class="px-5 py-1">
      <v-carousel
        height="100%"
        hide-delimiter-background
        :continuous="false"
        light
      >
        <v-carousel-item v-for="(item, index) in items" :key="index">
          <v-row class="d-flex flex-column fill-height">
            <v-col align="center">
              <h4 class="netmobiel">{{ item.title }}</h4>
            </v-col>
            <v-col class="my-3" align="center">
              <v-img
                :src="require(`@/assets/${item.icon}`)"
                max-height="150"
                max-width="150"
              />
            </v-col>
            <v-col align="center">
              <span>{{ item.description }}</span>
            </v-col>
            <v-col v-if="item.action">
              <v-btn
                color="button"
                depressed
                rounded
                large
                block
                @click="item.action.onclick"
              >
                {{ item.action.label }}
              </v-btn>
            </v-col>
            <v-col class="mb-5">&nbsp;</v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'SlideShowHowTo',
  props: {
    items: { type: Array, default: () => [] },
  },
}
</script>

<style lang="scss">
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
  .instruction {
    height: 450px;
    background-color: red;
  }
  .cards-container {
    padding: 8px 0;
    .trip-card {
      border-color: $color-alertRed !important;
      width: 90%;
      margin: auto;
      .v-card__actions {
        padding: 0;
        width: 16px;
        i {
          color: white;
        }
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
