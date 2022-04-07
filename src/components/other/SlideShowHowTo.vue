<template>
  <v-row>
    <v-col>
      <v-carousel hide-delimiter-background :continuous="false" light>
        <v-carousel-item v-for="(item, index) in items" :key="index">
          <v-container>
            <v-row class="d-flex flex-column fill-height">
              <v-col class="shrink">
                <h4 class="netmobiel text-center">{{ item.title }}</h4>
              </v-col>
              <v-col class="mb-6" align="center">
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
            </v-row>
          </v-container>
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
.v-window__container {
  .v-window__prev,
  .v-window__next {
    margin: -16px 16px !important;
  }
}
</style>
