<template>
  <v-container
    :class="{
      'container-non-scrollable': !scrollable,
      'container-scrollable': scrollable,
    }"
  >
    <slot></slot>
  </v-container>
</template>

<script>
export default {
  props: {
    scrollable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
}
</script>

<style lang="scss">
.container-non-scrollable {
  overflow: hidden;
}

.container-scrollable {
  height: 100vh;
  overflow: scroll;
}
</style>
