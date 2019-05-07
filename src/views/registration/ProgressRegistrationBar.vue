<template>
  <div id="progressbar" class="container">
    <div
      v-for="n in numbers"
      :id="n"
      :key="n"
      class="circle"
      :class="n <= currentSelected ? 'selected' : ''"
    >
      {{ n }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressRegistrationBar',
  data: function() {
    return {
      numbers: [1, 2, 3, 4],
    }
  },
  computed: {
    currentSelected() {
      return this.$store.getters.getRegistrationStep
    },
  },
}
</script>

<style lang="scss">
#progressbar {
  background-image: url('../../assets/spacer.gif');
  background-repeat: repeat-x;
  background-position: left;
  background-clip: content-box;

  display: flex;
  justify-content: space-between;
  position: relative;
}

.circle {
  border-radius: 50%;
  width: 27px;
  text-align: center;
  z-index: 2;
  color: $color-primary;
  border: 2px solid $color-primary;
  background: $color-secondary;
}

.selected {
  background: $color-primary;
  color: $color-secondary;
}
</style>
