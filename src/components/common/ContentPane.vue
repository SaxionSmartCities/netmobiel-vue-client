<template>
  <div>
    <slot name="header"></slot>
    <v-container
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

<style lang="scss">
.container-non-scrollable {
  overflow: hidden;
}

.container-scrollable {
  height: 100vh;
  overflow: scroll;
  padding-bottom: 56px;
}
</style>
