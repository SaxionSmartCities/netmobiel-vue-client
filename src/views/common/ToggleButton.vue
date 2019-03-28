<template>
  <div @click="buttonOnClick">
    <div class="btn btn-block default" :class="{ toggled: isToggled }">
      <i id="iconId" :class="icon"> </i>
    </div>
    <label>{{ name }}</label>
  </div>
</template>

<script>
export default {
  name: 'ToggleButton',

  props: ['icon', 'name'],

  data: function() {
    return {
      isToggled: false,
    }
  },
  methods: {
    buttonOnClick() {
      console.log('buttonOnClick')
      this.isToggled = !this.isToggled
      this.$emit('toggle', this.isToggled)
    },
  },
}
</script>

<style scoped lang="scss">
div {
  margin-top: 8px;
}

.default {
  background: $color-primary-light;
  color: $color-secondary-dark;
}

.toggled {
  background: $color-secondary-dark;
  color: $color-primary-light;
}
</style>
