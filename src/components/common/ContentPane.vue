<template>
  <div class="d-flex flex-column full-height">
    <slot name="header"></slot>
    <v-container
      class="justify-center align-content-start"
      :class="{
        'container-non-scrollable': !scrollable,
        'container-scrollable': scrollable,
        'no-padding': clearpadding,
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
    clearpadding: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped lang="scss">
.container-non-scrollable {
  overflow: hidden !important;
}

.container-scrollable {
  overflow: auto;
}

.no-padding {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
