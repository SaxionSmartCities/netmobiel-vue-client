<template>
  <div class="stepper">
    <template v-for="step in steps">
      <div
        :key="step"
        :class="{
          'step-active': step <= value,
          'step-outlined': step > value,
          'step-transition': transition,
        }"
      >
        <span class="body-2">{{ step }}</span>
      </div>
      <div
        :key="'line' + step"
        :class="{ 'line-active': step < value, 'line-transition': transition }"
        class="lines"
      ></div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Stepper',
  props: {
    value: { type: Number, required: false, default: 0 },
    steps: { type: Number, required: true },
    transition: { type: Boolean, required: false, default: true },
  },
}
</script>

<style lang="scss" scoped>
.stepper {
  display: flex;
  flex-direction: row;
  .lines {
    display: flex;
    flex-grow: 1;
    height: 1px;
    align-self: center;
    background-color: $color-light-grey;
    &:last-child {
      display: none;
    }
  }
  .line-active {
    background-color: $color-primary;
  }
  .line-transition {
    transition: background-color 0.4s ease-out;
  }

  .step-transition {
    transition: all 0.5s ease-out;
  }
  .step-active {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 50%;
    background-color: $color-primary;
    width: $stepper-width;
    height: $stepper-height;
  }
  .step-outlined {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 50%;
    border: 1px solid $color-light-grey;
    background-color: $color-light-grey;
    width: $stepper-width;
    height: $stepper-height;
  }
}
</style>
