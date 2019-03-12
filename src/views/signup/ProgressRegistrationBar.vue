<template>
  <div class="container" id="progressbar">
    <div
      class="circle"
      :class="n <= currentSelected ? 'selected' : ''"
      :id="n"
      :key="n"
      v-for="n in numbers"
    >{{ n }}</div>
  </div>
</template>

<script>
export default {
  name: "ProgressRegistrationBar",
  props: {
    currentSelected: Number
  },
  data: function() {
    return {
      numbers: [1, 2, 3, 4]
    };
  }
};
</script>

<style lang="scss">
#progressbar {
  background-image: url("../../assets/spacer.gif");
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
