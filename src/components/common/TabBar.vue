<template>
  <v-tabs
    id="tabs"
    v-model="selectedTab"
    grow
    centered
    slider-color="#bddade"
    :active-class="'lighter-tab'"
  >
    <v-tab class="white--text no-caps saved">
      <slot name="firstTab"> </slot>
    </v-tab>
    <v-tab class="white--text no-caps saved">
      <slot name="secondTab"></slot>
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    selectedTabModel: { type: Number, default: 0, required: true },
  },
  computed: {
    selectedTab: {
      get: function() {
        return this.selectedTabModel
      },
      set: function(value) {
        this.$emit('tabChange', value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.saved {
  background-color: $color-green;
}
.saved span {
  padding: 10px;
}
.no-caps {
  text-transform: none;
}
</style>
