<template>
  <div class="d-flex flex-column fill-height">
    <slot name="header"></slot>
    <v-container
      class="fill-height"
      :class="{
        'container-non-scrollable': !scrollable,
        'container-scrollable': scrollable,
      }"
    >
      <slot></slot>
    </v-container>
    <slot name="footer"></slot>
  </div>
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

<style scoped lang="scss">
.container-non-scrollable {
  overflow: hidden;
}

.container-scrollable {
  overflow: scroll;
}
</style>
