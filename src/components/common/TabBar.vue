<template>
  <v-tabs id="tabs" v-model="selectedTab" grow centered slider-color="#bddade">
    <v-tab class="white--text no-caps saved">
      <slot name="firstTab"> </slot>
      <!--      <v-icon color="white">commute</v-icon>-->
      <!--      <span>-->
      <!--        Reizen-->
      <!--        <sup>{{ getPlannedTripsCount }}</sup>-->
      <!--      </span>-->
    </v-tab>
    <v-tab class="white--text no-caps saved">
      <slot name="secondTab"></slot>
      <!--      <v-icon color="white">directions_car</v-icon>-->
      <!--      <span>-->
      <!--        Ritten-->
      <!--        <sup>{{ getPlannedRidesCount }}</sup>-->
      <!--      </span>-->
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
