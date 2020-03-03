<template>
  <div class="d-flex flex-column fill-height">
    <slot name="header"></slot>
    <v-container
      id="content-container"
      class="fill-height justify-center"
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
#content-container {
  align-content: start;
}
.container-non-scrollable {
  overflow: hidden;
}
.container-scrollable {
  overflow: scroll;
}
.no-padding {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
